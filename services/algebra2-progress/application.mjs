import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { appDirectory, validateProgress } from './catalog.mjs';
import { token, tokenHash, passwordHash, validPasswordHash, verifyPassword, LoginLimiter } from './auth.mjs';
import { setupHtml, setupScript } from './instructor-setup.mjs';

const clone = value => structuredClone(value);
const emptyAccounts = () => ({ schema: 'algebra2-accounts-v1', students: {}, enrollments: {}, sessions: {} });
const fail = (status, message, code) => Object.assign(Error(message), { status, code });
const studentKey = id => `students/${id}.json`;
const emptyProgress = student => ({ schema: 'algebra2-student-progress-v1', revision: 0, profile: { id: student.id, name: student.name, createdAt: student.createdAt, updatedAt: null, lessons: {} }, imports: [] });
function prune(accounts) {
  for (const collection of [accounts.sessions, accounts.enrollments]) for (const [id, entry] of Object.entries(collection)) if (entry.expiresAt <= Date.now()) delete collection[id];
}
function cookies(request) {
  const result = {};
  for (const item of (request.headers.cookie || '').split(';')) { const index = item.indexOf('='); if (index > 0) result[item.slice(0, index).trim()] = item.slice(index + 1).trim(); }
  return result;
}
async function body(request, limit = 5_000_000) {
  if (!/^application\/json(?:;|$)/i.test(request.headers['content-type'] || '')) throw fail(415, 'Send JSON content.');
  let length = 0; const chunks = [];
  for await (const chunk of request) { length += chunk.length; if (length > limit) throw fail(413, 'Request exceeds the allowed size.'); chunks.push(chunk); }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error();
    return value;
  } catch { throw fail(400, 'Invalid JSON request.'); }
}

export function createApplication({ store, catalog, config }) {
  const fixedPassword = validPasswordHash(config.passwordHash);
  const setupConfigured = !config.passwordHash && /^[a-f0-9]{64}$/.test(config.setupTokenHash || '') && Number.isFinite(Date.parse(config.setupExpiresAt));
  if ((!fixedPassword && !setupConfigured) || typeof config.instructorUsername !== 'string' || !config.instructorUsername || config.instructorUsername.length > 80) throw Error('Configure an instructor username and generated password hash, or a private expiring setup link, before starting.');
  const appUrl = new URL(config.publicAppUrl), apiUrl = new URL(config.apiPublicUrl || config.publicAppUrl);
  const production = config.production === true;
  if (production && (appUrl.protocol !== 'https:' || apiUrl.protocol !== 'https:')) throw Error('Production requires HTTPS application and API URLs.');
  const allowedOrigins = new Set([appUrl.origin, apiUrl.origin]);
  const cookieName = production ? '__Host-algebra2_session' : 'algebra2_session';
  const sameSite = config.sameSite || 'Lax';
  if (!['Lax', 'Strict', 'None'].includes(sameSite) || (!production && sameSite === 'None')) throw Error('Invalid session cookie configuration.');
  const limiter = new LoginLimiter(), enrollmentLimiter = new LoginLimiter({ attempts: 60 });
  const setupLimiter = new LoginLimiter({ attempts: 60 });
  const instanceId = crypto.randomUUID(), startedAt = new Date().toISOString();
  let passwordChecks = 0;
  const sessionCookie = (value, maxAge) => `${cookieName}=${value}; HttpOnly; Path=/; SameSite=${sameSite}; Max-Age=${maxAge}${production ? '; Secure' : ''}`;
  function json(response, status, value, headers = {}) { response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers }); response.end(JSON.stringify(value)); }
  async function instructorRecord() {
    const accounts = await store.read('accounts.json', emptyAccounts());
    if (accounts.instructor) {
      if (!validPasswordHash(accounts.instructor.passwordHash) || typeof accounts.instructor.username !== 'string') throw fail(503, 'Instructor configuration requires repair.');
      return accounts.instructor;
    }
    return fixedPassword ? { username: config.instructorUsername, passwordHash: config.passwordHash } : null;
  }
  async function requireSetup(request, secret) {
    if (!setupLimiter.take(request.socket.remoteAddress || 'unknown')) throw fail(429, 'Too many setup requests. Please wait before retrying.');
    if (!setupConfigured || Date.parse(config.setupExpiresAt) <= Date.now() || typeof secret !== 'string' || !/^[\w-]{43}$/.test(secret) || !crypto.timingSafeEqual(Buffer.from(tokenHash(secret), 'hex'), Buffer.from(config.setupTokenHash, 'hex'))) throw fail(410, 'This setup link is unavailable or expired. Request a replacement link.');
    if (await instructorRecord()) throw fail(410, 'Instructor setup is already complete. Use instructor sign-in.');
  }
  async function identify(request) {
    const secret = cookies(request)[cookieName];
    if (!secret || !/^[\w-]{43}$/.test(secret)) return null;
    const accounts = await store.read('accounts.json', emptyAccounts()), session = accounts.sessions[tokenHash(secret)];
    if (!session || session.expiresAt <= Date.now() || (session.role === 'student' && !accounts.students[session.studentId])) return null;
    return { ...session, secretHash: tokenHash(secret), student: session.role === 'student' ? accounts.students[session.studentId] : null };
  }
  async function requireRole(request, role) {
    const session = await identify(request);
    if (!session) throw fail(401, 'Sign-in is required.', 'SIGN_IN_REQUIRED');
    if (session.role !== role) throw fail(403, 'This action requires instructor access.');
    return session;
  }
  const server = http.createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store'); response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer'); response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    if (production) response.setHeader('Strict-Transport-Security', 'max-age=31536000');
    const origin = request.headers.origin;
    if (origin && allowedOrigins.has(origin)) { response.setHeader('Access-Control-Allow-Origin', origin); response.setHeader('Access-Control-Allow-Credentials', 'true'); response.setHeader('Vary', 'Origin'); }
    try {
      const url = new URL(request.url, apiUrl), route = url.pathname;
      if (origin && !allowedOrigins.has(origin)) throw fail(403, 'This origin is not allowed.');
      if (request.method === 'OPTIONS') { response.writeHead(204, { 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' }); response.end(); return; }
      if (['POST', 'PUT'].includes(request.method) && !allowedOrigins.has(origin)) throw fail(403, 'A valid application origin is required.');
      if (route === '/api/health' && request.method === 'GET') return json(response, 200, { status: 'ok', version: '0.3.0', instanceId, startedAt, gradePolicy: catalog.engine.gradePolicy });
      if ((route === '/instructor/setup' || route === '/instructor/setup.js') && request.method === 'GET') {
        response.writeHead(200, { 'Content-Type': route.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8' });
        return response.end(route.endsWith('.js') ? setupScript : setupHtml);
      }
      if (route === '/api/instructor/setup/status' && request.method === 'POST') {
        const data = await body(request, 4096); await requireSetup(request, data.token);
        return json(response, 200, { available: true, username: config.instructorUsername });
      }
      if (route === '/api/instructor/setup' && request.method === 'POST') {
        const data = await body(request, 4096); await requireSetup(request, data.token);
        if (typeof data.password !== 'string' || data.password.length < 15 || data.password.length > 256 || data.password !== data.confirmation) throw fail(400, 'Enter matching passphrases of 15–256 characters. Spaces are allowed.');
        if (passwordChecks >= 2) throw fail(429, 'Another sign-in or setup is being checked. Please retry.');
        let encoded; passwordChecks++;
        try { encoded = await passwordHash(data.password); } finally { passwordChecks--; }
        await store.update('accounts.json', emptyAccounts(), accounts => {
          if (accounts.instructor) throw fail(410, 'Instructor setup is already complete. Use instructor sign-in.');
          if (Date.parse(config.setupExpiresAt) <= Date.now()) throw fail(410, 'This setup link has expired. Request a replacement link.');
          accounts.instructor = { username: config.instructorUsername, passwordHash: encoded, createdAt: new Date().toISOString() };
        });
        return json(response, 201, { initialized: true, signInUrl: '/' });
      }
      if (route === '/api/session' && request.method === 'GET') {
        const session = await identify(request);
        return json(response, 200, session ? { authenticated: true, role: session.role, student: session.student && { id: session.student.id, name: session.student.name } } : { authenticated: false });
      }
      if (route === '/api/instructor/login' && request.method === 'POST') {
        const data = await body(request), username = String(data.username || '').slice(0, 80), ip = request.socket.remoteAddress || 'unknown';
        const allowedIp = limiter.take(`ip:${ip}`), allowedUser = limiter.take(`user:${username.toLowerCase()}`);
        if (!allowedIp || !allowedUser || passwordChecks >= 2) throw fail(429, 'Too many sign-in attempts. Please wait before retrying.');
        const instructor = await instructorRecord();
        if (!instructor) throw fail(503, 'Complete private instructor setup before signing in.');
        let valid; passwordChecks++;
        try { valid = await verifyPassword(data.password, instructor.passwordHash); } finally { passwordChecks--; }
        if (!valid || username !== instructor.username) throw fail(401, 'Incorrect instructor username or passphrase.');
        const secret = token(), expiresAt = Date.now() + 8 * 60 * 60 * 1000;
        await store.update('accounts.json', emptyAccounts(), accounts => { prune(accounts); accounts.sessions[tokenHash(secret)] = { role: 'instructor', expiresAt }; });
        return json(response, 200, { authenticated: true, role: 'instructor' }, { 'Set-Cookie': sessionCookie(secret, 8 * 60 * 60) });
      }
      if (route === '/api/enroll' && request.method === 'POST') {
        if (!enrollmentLimiter.take(request.socket.remoteAddress || 'unknown')) throw fail(429, 'Too many enrollment attempts.');
        const data = await body(request);
        if (typeof data.token !== 'string' || !/^[\w-]{43}$/.test(data.token)) throw fail(401, 'This enrollment link is invalid or expired.');
        const secret = token(), result = await store.update('accounts.json', emptyAccounts(), accounts => {
          prune(accounts); const key = tokenHash(data.token), invite = accounts.enrollments[key];
          if (!invite || !accounts.students[invite.studentId]) throw fail(401, 'This enrollment link is invalid or expired.');
          const student = accounts.students[invite.studentId]; delete accounts.enrollments[key];
          accounts.sessions[tokenHash(secret)] = { role: 'student', studentId: student.id, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 };
          return { authenticated: true, role: 'student', student: { id: student.id, name: student.name } };
        });
        return json(response, 200, result, { 'Set-Cookie': sessionCookie(secret, 30 * 24 * 60 * 60) });
      }
      if (route === '/api/logout' && request.method === 'POST') {
        const session = await identify(request);
        if (session) await store.update('accounts.json', emptyAccounts(), accounts => { delete accounts.sessions[session.secretHash]; prune(accounts); });
        return json(response, 200, { signedOut: true }, { 'Set-Cookie': sessionCookie('', 0) });
      }
      if (route === '/api/progress' && request.method === 'GET') {
        const session = await requireRole(request, 'student'), progress = await store.read(studentKey(session.studentId), emptyProgress(session.student));
        progress.profile.name = session.student.name;
        return json(response, 200, { ...progress, gradePolicy: catalog.engine.gradePolicy });
      }
      if (route === '/api/progress' && request.method === 'PUT') {
        const session = await requireRole(request, 'student'), data = await body(request);
        const result = await store.update(studentKey(session.studentId), emptyProgress(session.student), document => {
          if (!Number.isInteger(data.revision) || data.revision !== document.revision) throw fail(409, 'Another device has newer progress. Save a local backup, then reload the server copy.', 'REVISION_CONFLICT');
          const lessons = validateProgress(catalog, data.lessons, document.profile.lessons);
          document.profile = { ...document.profile, id: session.studentId, name: session.student.name, lessons, updatedAt: new Date().toISOString() };
          document.revision++; document.gradePolicy = catalog.engine.gradePolicy.id;
          return { revision: document.revision, updatedAt: document.profile.updatedAt };
        });
        return json(response, 200, result);
      }
      if (route === '/api/instructor/students' && request.method === 'GET') {
        await requireRole(request, 'instructor'); const accounts = await store.read('accounts.json', emptyAccounts());
        return json(response, 200, { students: Object.values(accounts.students).sort((a, b) => a.name.localeCompare(b.name)) });
      }
      if (route === '/api/instructor/students' && request.method === 'POST') {
        await requireRole(request, 'instructor'); const data = await body(request), name = String(data.name || '').trim();
        if (!name || name.length > 80) throw fail(400, 'Enter a student name of 1–80 characters.');
        const student = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() };
        await store.update('accounts.json', emptyAccounts(), accounts => { if (Object.keys(accounts.students).length >= 500) throw fail(409, 'This deployment supports up to 500 roster entries.'); accounts.students[student.id] = student; });
        return json(response, 201, { student });
      }
      const studentRoute = /^\/api\/instructor\/students\/([a-f0-9-]{36})\/(enrollment|report|import|revoke)$/.exec(route);
      if (studentRoute) {
        await requireRole(request, 'instructor'); const [, id, action] = studentRoute, accounts = await store.read('accounts.json', emptyAccounts()), student = accounts.students[id];
        if (!student) throw fail(404, 'Student not found.');
        if (action === 'enrollment' && request.method === 'POST') {
          const secret = token(), expiresAt = Date.now() + 24 * 60 * 60 * 1000;
          await store.update('accounts.json', emptyAccounts(), document => { prune(document); for (const [key, entry] of Object.entries(document.enrollments)) if (entry.studentId === id) delete document.enrollments[key]; document.enrollments[tokenHash(secret)] = { studentId: id, expiresAt }; });
          const link = new URL(config.publicAppUrl); link.hash = `enroll=${secret}`;
          return json(response, 201, { link: link.href, expiresAt: new Date(expiresAt).toISOString(), singleUse: true });
        }
        if (action === 'report' && request.method === 'GET') {
          const document = await store.read(studentKey(id), emptyProgress(student)); document.profile.name = student.name;
          return json(response, 200, { ...catalog.engine.profileReport(catalog.registry, document.profile), revision: document.revision, imports: document.imports, archivedLessonIds: Object.keys(document.profile.lessons).filter(id => !catalog.registry.get(id)) });
        }
        if (action === 'revoke' && request.method === 'POST') {
          await store.update('accounts.json', emptyAccounts(), document => { prune(document); for (const collection of [document.sessions, document.enrollments]) for (const [key, entry] of Object.entries(collection)) if (entry.studentId === id) delete collection[key]; });
          return json(response, 200, { revoked: true });
        }
        if (action === 'import' && request.method === 'POST') {
          const data = await body(request);
          const result = await store.update(studentKey(id), emptyProgress(student), document => {
            if (data.revision !== document.revision) throw fail(409, 'Student progress changed. Refresh the report before importing.');
            if (!data.profile || typeof data.profile !== 'object') throw fail(400, 'Choose one local student profile to import.');
            const lessons = validateProgress(catalog, data.profile.lessons, {}, { imported: true });
            const importedAt = new Date().toISOString();
            document.profile.lessons = { ...document.profile.lessons, ...lessons };
            document.profile.updatedAt = importedAt; document.revision++;
            document.imports.push({ importedAt, lessonIds: Object.keys(lessons), provenance: 'instructor-imported-local-records', originalProfileName: String(data.profile.name || '').slice(0, 80) });
            return { revision: document.revision, importedLessons: Object.keys(lessons).length };
          });
          return json(response, 200, result);
        }
      }
      if (route.startsWith('/api/')) throw fail(404, 'API route not found.');
      if (!['GET', 'HEAD'].includes(request.method)) throw fail(405, 'Method not allowed.');
      if (route === '/config.js' || route === '/src/config.js') {
        response.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
        return response.end('window.Algebra2Config = { connected: true, apiBaseUrl: "" };');
      }
      const relative = decodeURIComponent(route === '/' ? '/index.html' : route);
      if (!/^\/(?:index\.html|engine\.js|accounts\.js|config\.js|accounts\.css|catalog\.json|src\/(?:engine\.js|course\.js|config\.js|styles\.css|accounts\.css)|lessons\/lesson-\d{3}\.js)$/.test(relative)) throw fail(404, 'File not found.');
      const contents = await fs.readFile(path.join(catalog.directory || appDirectory, relative.slice(1)));
      const extension = path.extname(relative), mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' }[extension];
      response.writeHead(200, { 'Content-Type': `${mime}; charset=utf-8` }); response.end(request.method === 'HEAD' ? undefined : contents);
    } catch (error) {
      const status = Number.isInteger(error.status) ? error.status : error.code === 'ENOENT' ? 404 : 500;
      json(response, status, { error: status >= 500 ? 'The service could not complete this request. Local work remains available; retry synchronization.' : error.message, ...(error.code && error.status ? { code: error.code } : {}) });
    }
  });
  server.requestTimeout = 30000; server.headersTimeout = 15000;
  return server;
}
