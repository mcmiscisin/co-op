import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { FileStore, GitHubStore } from './store.mjs';
import { loadCatalog } from './catalog.mjs';
import { createApplication } from './application.mjs';

export async function start(environment = process.env) {
  const production = environment.NODE_ENV === 'production';
  if (production && !/^[\w.-]+\/[\w.-]+$/.test(environment.GITHUB_CODE_REPOSITORY || '')) throw Error('Configure GITHUB_CODE_REPOSITORY so the progress repository can be verified as separate.');
  const storage = environment.STORAGE_DRIVER || (production ? 'github' : 'file');
  if (production && storage !== 'github') throw Error('Production requires private GitHub storage.');
  const store = storage === 'github' ? new GitHubStore({
    owner: environment.GITHUB_DATA_OWNER, repository: environment.GITHUB_DATA_REPOSITORY,
    branch: environment.GITHUB_DATA_BRANCH || 'main', appId: environment.GITHUB_APP_ID,
    installationId: environment.GITHUB_APP_INSTALLATION_ID, privateKey: environment.GITHUB_APP_PRIVATE_KEY,
    codeRepository: environment.GITHUB_CODE_REPOSITORY || ''
  }) : storage === 'file' ? new FileStore(environment.LOCAL_DATA_DIRECTORY || path.resolve('.local-data')) : null;
  if (!store) throw Error('Unknown storage driver.');
  const port = Number(environment.PORT || 8787);
  const publicUrl = environment.PUBLIC_APP_URL || environment.RENDER_EXTERNAL_URL || `http://localhost:${port}/`;
  const server = createApplication({ store, catalog: loadCatalog(environment.APP_DIRECTORY), config: {
    production, publicAppUrl: publicUrl,
    apiPublicUrl: environment.API_PUBLIC_URL || publicUrl,
    instructorUsername: environment.INSTRUCTOR_USERNAME,
    passwordHash: environment.INSTRUCTOR_PASSWORD_HASH,
    setupTokenHash: environment.INSTRUCTOR_SETUP_TOKEN_HASH,
    setupExpiresAt: environment.INSTRUCTOR_SETUP_EXPIRES_AT,
    sameSite: environment.SESSION_SAME_SITE || 'Lax'
  } });
  await store.ready();
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, environment.HOST || (production ? '0.0.0.0' : '127.0.0.1'), resolve); });
  console.log(`Algebra 2 service 0.3.0 listening on port ${server.address().port}; storage: ${storage}.`);
  return server;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  start().catch(error => { console.error(error.message); process.exitCode = 1; });
}
