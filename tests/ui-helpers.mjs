import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Root package.json is ESM, so CommonJS-style libs are evaluated manually.
export function loadCjs(rel) {
  const src = readFileSync(join(ROOT, rel), 'utf8');
  const module = { exports: {} };
  new Function('module', 'exports', src)(module, module.exports);
  return module.exports;
}
