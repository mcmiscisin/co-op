import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const clone = value => structuredClone(value);
const validKey = key => /^(accounts|students\/[a-f0-9-]{36})\.json$/.test(key);
export class MemoryStore {
  constructor() { this.documents = new Map(); this.tail = Promise.resolve(); }
  async ready() {}
  async read(key, fallback = null) { if (!validKey(key)) throw Error('Invalid storage key.'); return clone(this.documents.get(key) ?? fallback); }
  async update(key, fallback, change) {
    const work = this.tail.then(async () => {
      const document = await this.read(key, fallback), result = change(document);
      this.documents.set(key, clone(document)); return clone(result);
    });
    this.tail = work.catch(() => {}); return work;
  }
}

export class FileStore extends MemoryStore {
  constructor(directory) { super(); this.directory = path.resolve(directory); }
  async ready() { await fs.mkdir(this.directory, { recursive: true }); }
  file(key) { if (!validKey(key)) throw Error('Invalid storage key.'); return path.join(this.directory, key); }
  async read(key, fallback = null) {
    try { return JSON.parse(await fs.readFile(this.file(key), 'utf8')); }
    catch (error) { if (error.code === 'ENOENT') return clone(fallback); throw error; }
  }
  async update(key, fallback, change) {
    const work = this.tail.then(async () => {
      const document = await this.read(key, fallback), result = change(document), filename = this.file(key);
      await fs.mkdir(path.dirname(filename), { recursive: true });
      const temporary = `${filename}.${crypto.randomUUID()}.tmp`;
      await fs.writeFile(temporary, JSON.stringify(document), { mode: 0o600 });
      await fs.rename(temporary, filename);
      return clone(result);
    });
    this.tail = work.catch(() => {}); return work;
  }
}

export class GitHubStore {
  constructor({ owner, repository, branch = 'main', appId, installationId, privateKey, codeRepository = '', fetchImpl = fetch }) {
    if (![owner, repository, branch, appId, installationId, privateKey].every(Boolean)) throw Error('GitHub App storage configuration is incomplete.');
    if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repository)) throw Error('Invalid GitHub repository.');
    if (`${owner}/${repository}`.toLowerCase() === codeRepository.toLowerCase()) throw Error('Progress storage must be separate from the course repository.');
    Object.assign(this, { owner, repository, branch, appId, installationId, privateKey: privateKey.replace(/\\n/g, '\n'), fetchImpl });
    this.token = null; this.tail = Promise.resolve();
  }
  async accessToken() {
    if (this.token?.expiresAt > Date.now() + 60000) return this.token.value;
    const now = Math.floor(Date.now() / 1000), encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
    const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({ iat: now - 60, exp: now + 500, iss: this.appId })}`;
    const jwt = `${unsigned}.${crypto.sign('RSA-SHA256', Buffer.from(unsigned), this.privateKey).toString('base64url')}`;
    const response = await this.fetchImpl(`https://api.github.com/app/installations/${encodeURIComponent(this.installationId)}/access_tokens`, {
      method: 'POST', headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${jwt}`, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'Algebra2-Progress-Service' },
      body: JSON.stringify({ repositories: [this.repository], permissions: { contents: 'write' } }), signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw Object.assign(Error('GitHub App authentication failed.'), { status: 503 });
    const data = await response.json();
    this.token = { value: data.token, expiresAt: Date.parse(data.expires_at) };
    return this.token.value;
  }
  async request(resource, options = {}) {
    return this.fetchImpl(`https://api.github.com/repos/${this.owner}/${this.repository}${resource}`, {
      ...options, headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${await this.accessToken()}`, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'Algebra2-Progress-Service', ...options.headers }, signal: AbortSignal.timeout(15000)
    });
  }
  async ready() {
    const response = await this.request('');
    if (!response.ok) throw Error('Cannot verify the progress repository.');
    const data = await response.json();
    if (data.private !== true) throw Error('Progress repository must be private.');
  }
  resource(key) { if (!validKey(key)) throw Error('Invalid storage key.'); return `/contents/progress/${key.split('/').map(encodeURIComponent).join('/')}`; }
  async snapshot(key, fallback) {
    const resource = this.resource(key), response = await this.request(`${resource}?ref=${encodeURIComponent(this.branch)}`);
    if (response.status === 404) return { document: clone(fallback), sha: null };
    if (!response.ok) throw Object.assign(Error('Progress storage is unavailable.'), { status: 503 });
    const data = await response.json(); let text;
    if (data.encoding === 'base64') text = Buffer.from(data.content, 'base64').toString('utf8');
    else {
      const raw = await this.request(`${resource}?ref=${encodeURIComponent(this.branch)}`, { headers: { Accept: 'application/vnd.github.raw+json' } });
      if (!raw.ok) throw Object.assign(Error('Cannot read saved progress.'), { status: 503 });
      text = await raw.text();
    }
    return { document: JSON.parse(text), sha: data.sha };
  }
  async read(key, fallback = null) { return (await this.snapshot(key, fallback)).document; }
  async update(key, fallback, change) {
    const work = this.tail.then(async () => {
      for (let attempt = 0; attempt < 5; attempt++) {
        const { document, sha } = await this.snapshot(key, fallback), result = change(document);
        const response = await this.request(this.resource(key), {
          method: 'PUT', body: JSON.stringify({ message: `Save Algebra 2 progress (${key === 'accounts.json' ? 'accounts' : 'student'})`, content: Buffer.from(JSON.stringify(document)).toString('base64'), branch: this.branch, ...(sha ? { sha } : {}) })
        });
        if (response.ok) return clone(result);
        if (![409, 422].includes(response.status)) throw Object.assign(Error('Progress was not saved to GitHub.'), { status: 503 });
      }
      throw Object.assign(Error('Concurrent updates prevented saving. Please retry.'), { status: 503 });
    });
    this.tail = work.catch(() => {}); return work;
  }
}
