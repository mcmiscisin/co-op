import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { loadCatalog } from './catalog.mjs';
import { fileURLToPath } from 'node:url';
for (const file of fs.readdirSync(new URL('.', import.meta.url)).filter(name => name.endsWith('.mjs'))) {
 const result = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(file, import.meta.url))], { stdio: 'inherit' });
 if (result.status !== 0) process.exit(result.status || 1);
}
const catalog = loadCatalog();
console.log(JSON.stringify({ lessonIds: catalog.registry.available().map(pkg => pkg.id), questions: catalog.registry.available().reduce((n, pkg) => n + pkg.buildQuestions().length, 0) }));
