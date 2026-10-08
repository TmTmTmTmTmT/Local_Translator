import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { measure, MARK } from './e2e/site-coverage.mjs';

const fixture = join(dirname(fileURLToPath(import.meta.url)), 'e2e', 'fixtures', 'cards.html');

test('site-coverage measures the offline fixture', async () => {
  const r = await measure(fixture, { quietMs: 150, timeoutMs: 15000 });
  assert.deepEqual(r.errors, []);
  assert.ok(r.calls >= 1 && r.blocks >= 1);
  assert.ok(r.translatedNodes >= 5, 'translated ' + r.translatedNodes);
  assert.equal(r.byCategory.translateNo, 2);
  assert.equal(r.byCategory.inCode, 2);
  assert.equal(r.remaining, Object.values(r.byCategory).reduce((a, b) => a + b, 0));
  assert.equal(r.byCategory.other, 0, JSON.stringify(r.samples.other));
  assert.ok(!JSON.stringify(r.samples).includes('Hidden paragraph never'));
  assert.equal(MARK, '\u{D55C}(');
});

test('site-coverage reports linkMode and handles a custom page', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'kt-cov-'));
  const f = join(dir, 'p.html');
  writeFileSync(f, '<!doctype html><html lang="en"><body><p>Plain paragraph with enough words.</p><div aria-hidden="true">Aria hidden words</div></body></html>');
  const r = await measure(f, { linkMode: 'never', quietMs: 150, timeoutMs: 15000 });
  assert.equal(r.linkMode, 'never');
  assert.ok(r.translatedNodes >= 1); // aria-hidden text may be translated; only remaining text excludes hidden
  assert.equal(r.remaining, 0);
});

test('build-inject bundle is syntactically valid', async () => {
  const { execFileSync } = await import('node:child_process');
  const out = join(mkdtempSync(join(tmpdir(), 'kt-inj-')), 'inject.js');
  execFileSync(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), 'e2e', 'build-inject.mjs'), out]);
  new Function(readFileSync(out, 'utf8'));
});
