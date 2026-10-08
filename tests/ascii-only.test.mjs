import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { stripComments, escapeNonAsciiInCode } from '../scripts/lib/jslex.mjs';

const root = join(fileURLToPath(import.meta.url), '../../extension');
const manifest = JSON.parse(fs.readFileSync(join(root, 'manifest.json'), 'utf8'));
const bg = fs.readFileSync(join(root, 'background.js'), 'utf8');
const contentList = [...bg.matchAll(/const CONTENT(?:_EXTRA)?_JS = (\[[^\]]*\]|'[^']*')/g)].flatMap((m) => [...m[1].matchAll(/'([^']+\.js)'/g)].map((x) => x[1]));
// Scripts Safari loads without a charset declaration (background + registered content scripts). HTML pages declare utf-8.
const files = [...new Set([...manifest.background.scripts, ...contentList])];

test('script list sanity', () => {
  assert.ok(contentList.includes('content/main.js') && contentList.includes('content/extra.js'));
  assert.ok(files.includes('background.js') && files.includes('lib/josa.js'));
});

test('background/content scripts contain no non-ASCII outside comments (Safari decodes them without charset; FIX_GUIDE F4)', () => {
  for (const f of files) {
    const code = stripComments(fs.readFileSync(join(root, f), 'utf8'));
    const bad = [...code].filter((c) => c.charCodeAt(0) > 127);
    assert.equal(bad.length, 0, `${f}: ${bad.slice(0, 8).join('')} (run: node scripts/escape-nonascii.mjs extension/${f})`);
  }
});

test('manifest background scripts include every engine module the tests load, common.js first', () => {
  const list = manifest.background.scripts;
  for (const m of ['common', 'prompt', 'mtmode', 'native', 'localhost', 'registry']) assert.ok(list.includes(`engines/${m}.js`), m);
  assert.ok(list.indexOf('engines/common.js') < list.indexOf('engines/prompt.js'));
  assert.ok(list.indexOf('engines/registry.js') < list.indexOf('background.js'));
});

test('lexer: comments untouched, strings/regex/template escaped, // inside strings is not a comment', () => {
  const src = "const a = '한'; // 주석\nconst r = /[가-힯]/; const u = 'http://x/한';\nconst t = `x ${'값'} 끝`; /* 블록 */ const d = 4 / 2; // 끝";
  const out = escapeNonAsciiInCode(src);
  assert.ok(out.includes('// 주석') && out.includes('/* 블록 */') && out.includes('// 끝'));
  assert.ok(out.includes("'\\ud55c'") && out.includes('[\\uac00-\\ud7af]') && out.includes('http://x/\\ud55c') && out.includes('\\uac12') && out.includes('\\ub05d'));
  assert.equal([...stripComments(out)].filter((c) => c.charCodeAt(0) > 127).length, 0);
  // semantics preserved
  const run = (s) => new Function(s + '; return [a, r.test("한"), u, t, d]')();
  assert.deepEqual(run(out), run(src));
});
