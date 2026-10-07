// Tiny argv parser + result writer shared by all adapters and run.mjs.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

// "--k v" -> {k:"v"}; "--flag" (no value or next is another option) -> true. Repeated keys: last wins.
export function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq > 0) { out[camel(a.slice(2, eq))] = a.slice(eq + 1); continue; }
      const key = camel(a.slice(2));
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) out[key] = true;
      else { out[key] = next; i++; }
    } else out._.push(a);
  }
  return out;
}

export function writeJson(path, obj) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(obj, null, 1) + '\n');
}
