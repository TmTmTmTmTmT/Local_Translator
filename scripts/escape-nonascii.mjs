// Rewrite non-ASCII characters in code (not comments) of the given JS files as \uXXXX escapes.
// Safari decodes background/content scripts without a charset, so literals must be ASCII (FIX_GUIDE F4).
//   node scripts/escape-nonascii.mjs <file...> [--check]
import fs from 'node:fs';
import { escapeNonAsciiInCode } from './lib/jslex.mjs';

const check = process.argv.includes('--check');
let dirty = 0;
for (const f of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
  const src = fs.readFileSync(f, 'utf8');
  const out = escapeNonAsciiInCode(src);
  if (out !== src) { dirty++; if (!check) fs.writeFileSync(f, out); console.log(`${check ? 'needs escape' : 'escaped'}: ${f}`); }
}
process.exit(check && dirty ? 1 : 0);
