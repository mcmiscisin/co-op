import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
export const appDirectory = fs.existsSync(path.resolve(moduleDirectory, '../Course App/index.html'))
  ? path.resolve(moduleDirectory, '../Course App') : path.resolve(moduleDirectory, '../../algebra-2');

export function loadCatalog(directory = appDirectory) {
  directory = path.resolve(directory);
  const integrated = fs.existsSync(path.join(directory, 'src/engine.js'));
  const context = vm.createContext({ console });
  context.window = context;
  vm.runInContext(fs.readFileSync(path.join(directory, integrated ? 'src/engine.js' : 'engine.js'), 'utf8'), context, { timeout: 2000, filename: 'engine.js' });
  // The deployed index is authoritative for its installed package inventory; older course metadata is intentionally preserved.
  const catalog = integrated ? { lessons: [...fs.readFileSync(path.join(directory, 'index.html'), 'utf8').matchAll(/<script\s+src=["']lessons\/(lesson-\d{3})\.js["']\s*>/g)].map(match => match[1]) }
    : JSON.parse(fs.readFileSync(path.join(directory, 'catalog.json'), 'utf8'));
  if (!catalog.lessons.length || new Set(catalog.lessons).size !== catalog.lessons.length) throw Error('Invalid installed lesson inventory.');
  for (const id of catalog.lessons) {
    if (!/^lesson-\d{3}$/.test(id)) throw Error('Invalid catalog identifier.');
    vm.runInContext(fs.readFileSync(path.join(directory, 'lessons', `${id}.js`), 'utf8'), context, { timeout: 2000, filename: `${id}.js` });
  }
  const engine = context.Algebra2Engine, registry = context.Algebra2CourseRegistry;
  if (registry.available().length !== catalog.lessons.length) throw Error('Catalog registration mismatch.');
  for (const pkg of registry.available()) {
    const questions = pkg.buildQuestions();
    if (new Set(questions.map(q => q.id)).size !== questions.length) throw Error(`Duplicate question ID in ${pkg.id}`);
    if (questions.some(q => !['practice', 'problem'].includes(q.section))) throw Error(`Unweighted section in ${pkg.id}`);
  }
  return { engine, registry, directory, integrated };
}

export function validateProgress(catalog, incoming, existing = {}, { imported = false } = {}) {
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) throw Object.assign(Error('Lessons must be an object.'), { status: 400 });
  const result = {};
  for (const id of Object.keys(existing)) {
    if (!Object.hasOwn(incoming, id)) throw Object.assign(Error('Saved lessons cannot be removed by a student.'), { status: 409 });
  }
  for (const [id, raw] of Object.entries(incoming)) {
    const pkg = catalog.registry.get(id);
    if (!pkg) {
      if (!/^lesson-\d{3}$/.test(id) || !raw || typeof raw !== 'object' || Array.isArray(raw)) throw Object.assign(Error('Invalid archived lesson.'), { status: 400 });
      if (!imported && (!existing[id] || JSON.stringify(raw) !== JSON.stringify(existing[id]))) throw Object.assign(Error('Uninstalled lessons can only be archived by an instructor import.'), { status: 400 });
      result[id] = JSON.parse(JSON.stringify(raw));
      continue;
    }
    const questionMap = new Map(pkg.buildQuestions().map(q => [q.id, q]));
    if (!raw || typeof raw !== 'object' || Object.keys(raw.answers || {}).some(id => !questionMap.has(id))) throw Object.assign(Error('Unknown question in progress.'), { status: 400 });
    for (const record of Object.values(raw.answers || {})) {
      if (!Array.isArray(record.attempts) || record.attempts.length > 500) throw Object.assign(Error('Invalid attempt history.'), { status: 400 });
    }
    let normalized;
    try { normalized = catalog.engine.normalizeLessonState(pkg, raw); }
    catch { throw Object.assign(Error('Invalid lesson progress.'), { status: 400 }); }
    if (!imported) {
      for (const [qid, question] of questionMap) {
        const old = existing[id]?.answers?.[qid] || catalog.engine.helpers.blankRecord();
        const next = normalized.answers[qid] || catalog.engine.helpers.blankRecord();
        if (next.attempts.length < old.attempts.length || (old.revealed && !next.revealed)) throw Object.assign(Error('Saved attempts or solution reveals cannot be removed.'), { status: 409 });
        for (let i = 0; i < old.attempts.length; i++) {
          if (JSON.stringify(old.attempts[i]) !== JSON.stringify(next.attempts[i])) throw Object.assign(Error('Saved attempts cannot be changed.'), { status: 409 });
        }
        const accumulated = JSON.parse(JSON.stringify(old));
        for (const attempt of next.attempts.slice(old.attempts.length)) {
          if (catalog.engine.helpers.scoringFor(question, accumulated).done) throw Object.assign(Error('This exercise is already complete.'), { status: 409 });
          accumulated.attempts.push(attempt);
        }
        next.hints = Math.max(old.hints || 0, next.hints || 0);
      }
      normalized.read = [...new Set([...(existing[id]?.read || []), ...normalized.read])];
    }
    normalized.startedAt = existing[id]?.startedAt || normalized.startedAt || new Date().toISOString();
    normalized.updatedAt = new Date().toISOString();
    normalized.completedAt = catalog.engine.lessonStats(pkg, normalized).complete ? existing[id]?.completedAt || new Date().toISOString() : null;
    result[id] = normalized;
  }
  return JSON.parse(JSON.stringify(result));
}
