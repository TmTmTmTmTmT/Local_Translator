import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCjs } from './ui-helpers.mjs';

const lib = loadCjs('extension/options/options-lib.js');

test('defaults merge when settings missing or garbage', () => {
  assert.deepEqual(lib.mergeSettings(undefined), lib.defaults());
  assert.deepEqual(lib.mergeSettings('x'), lib.defaults());
  const m = lib.mergeSettings({ engine: { default: 'bogus', byLang: { ja: 'local:mlx', zh: 'nope' } }, localhost: { kind: 'x' } });
  assert.equal(m.engine.default, 'native:apple-mt');
  assert.equal(m.engine.byLang.ja, 'local:mlx');
  assert.equal(m.engine.byLang.zh, null);
  assert.equal(m.localhost.kind, 'ollama');
  assert.equal(m.localhost.baseUrl, 'http://127.0.0.1:11434');
});

test('merge preserves valid stored values', () => {
  const m = lib.mergeSettings({ sites: [{ host: 'a.com', exclude: '.x' }, { nothost: 1 }], enabled: false, localhost: { baseUrl: 'http://localhost:8080', kind: 'mlx', model: 'q' } });
  assert.deepEqual(m.sites, [{ host: 'a.com', exclude: '.x' }]);
  assert.equal(m.enabled, false);
  assert.equal(m.localhost.kind, 'mlx');
});

test('parseSitesText normalizes, dedups, reports invalid', () => {
  const r = lib.parseSitesText('Example.com\n\n# c\n*.docs.example.com\nexample.com\nbad host\nhttp://x.com\n-a.com');
  assert.deepEqual(r.hosts, ['example.com', 'docs.example.com']);
  assert.deepEqual(r.errors.map((e) => e.line), [6, 7, 8]);
});

test('parseExcludeText merges per host and validates', () => {
  const r = lib.parseExcludeText('a.com | .ad\na.com | #nav\nnoseparator\nb.com |\nbad host | .x\nc.com | !!', (s) => s !== '!!');
  assert.deepEqual(r.map, { 'a.com': '.ad, #nav' });
  assert.equal(r.errors.length, 4);
});

test('buildSites and text round trip', () => {
  const b = lib.buildSites('a.com\nb.com', 'a.com | .ad\nz.com | .q');
  assert.deepEqual(b.sites, [{ host: 'a.com', exclude: '.ad' }, { host: 'b.com', exclude: '' }]);
  assert.equal(b.errors.length, 1);
  assert.equal(lib.sitesToText(b.sites), 'a.com\nb.com');
  assert.equal(lib.excludesToText(b.sites), 'a.com | .ad');
  const again = lib.buildSites(lib.sitesToText(b.sites), lib.excludesToText(b.sites));
  assert.deepEqual(again.sites, b.sites);
  assert.equal(again.errors.length, 0);
});

test('loopback validation', () => {
  for (const ok of ['http://127.0.0.1:11434', 'http://localhost:8080', 'http://[::1]:1234/v1']) assert.ok(lib.isLoopbackUrl(ok), ok);
  for (const bad of ['http://example.com', 'https://127.0.0.1', 'http://127.0.0.1.evil.com', 'http://user@127.0.0.1', 'http://192.168.0.2:1', 'junk', '', 'http://127.0.0.2']) assert.ok(!lib.isLoopbackUrl(bad), bad);
  assert.equal(lib.validateLocalhost({ baseUrl: 'http://127.0.0.1:1', kind: 'mlx' }).length, 0);
  assert.equal(lib.validateLocalhost({ baseUrl: 'http://x.com', kind: 'zzz' }).length, 2);
});

test('mt-mode localhost settings: family and keepAlive', () => {
  const d = lib.defaults();
  assert.equal(d.localhost.family, 'hymt2');
  assert.equal(d.localhost.keepAlive, 300);
  const m = lib.mergeSettings({ localhost: { family: 'translategemma', keepAlive: 60.7 } });
  assert.equal(m.localhost.family, 'translategemma');
  assert.equal(m.localhost.keepAlive, 60);
  const bad = lib.mergeSettings({ localhost: { family: 'x', keepAlive: 'a' } });
  assert.equal(bad.localhost.family, 'hymt2');
  assert.equal(bad.localhost.keepAlive, 300);
  assert.ok(lib.ENGINES.some((e) => e.id === 'local:mt-ollama') && lib.ENGINES.some((e) => e.id === 'local:mt-mlx'));
  assert.equal(lib.validateLocalhost({ baseUrl: 'http://127.0.0.1:1', kind: 'mlx', family: 'chat', keepAlive: 0 }).length, 0);
  assert.equal(lib.validateLocalhost({ baseUrl: 'http://127.0.0.1:1', kind: 'mlx', family: 'zz', keepAlive: -5 }).length, 2);
  assert.equal(lib.validateLocalhost({ baseUrl: 'http://evil.com', kind: 'mlx', family: 'chat', keepAlive: 300 }).length, 1);
});

test('translateAttrs / fixParticles defaults, merge and garbage handling', () => {
  const d = lib.defaults();
  assert.equal(d.translateAttrs, false);
  assert.equal(d.fixParticles, true);
  const m = lib.mergeSettings({ translateAttrs: true, fixParticles: false });
  assert.equal(m.translateAttrs, true);
  assert.equal(m.fixParticles, false);
  const bad = lib.mergeSettings({ translateAttrs: 'yes', fixParticles: 0 });
  assert.equal(bad.translateAttrs, false);
  assert.equal(bad.fixParticles, true);
});

test('TranslateGemma preset is valid and uses a known engine', () => {
  const p = lib.PRESET_TRANSLATEGEMMA;
  assert.ok(lib.ENGINES.some((e) => e.id === p.engine));
  assert.deepEqual(lib.validateLocalhost(p.localhost), []);
  assert.equal(p.localhost.family, 'translategemma');
});

test('glossary text parse/format, errors, and attribute preservation', () => {
  const prev = [{ src: 'Kerbs', dst: '연석', lang: 'en', case: true }];
  const r = lib.parseGlossaryText('# c\nkerbs => 연석\nsafety car=>세이프티카\nbad line\n=> x\nSAFETY CAR => 중복\n', prev);
  assert.deepEqual(r.terms, [{ src: 'kerbs', dst: '연석', lang: 'en', case: true }, { src: 'safety car', dst: '세이프티카' }]);
  assert.deepEqual(r.errors.map((e) => e.line), [4, 5, 6]);
  assert.equal(lib.glossaryToText(r.terms), 'kerbs => 연석\nsafety car => 세이프티카');
  assert.equal(lib.parseGlossaryText('x'.repeat(81) + ' => y').errors.length, 1);
  assert.deepEqual(lib.mergeSettings({}).glossary, []);
  assert.deepEqual(lib.mergeSettings({ glossary: 'x' }).glossary, []);
  assert.equal(lib.mergeSettings({ glossary: prev }).glossary, prev);
});

test('linkMode default standalone; never kept; garbage falls back', () => {
  assert.equal(lib.defaults().linkMode, 'standalone');
  assert.equal(lib.mergeSettings({ linkMode: 'never' }).linkMode, 'never');
  assert.equal(lib.mergeSettings({ linkMode: 5 }).linkMode, 'standalone');
});

test('error messages name the source field and line', () => {
  const b = lib.buildSites('a.com\nbad host\n', 'a.com | !!\nz.com | .q', (s) => s !== '!!');
  const msgs = b.errors.map(lib.formatError);
  assert.ok(msgs.includes('사이트 2줄: 잘못된 호스트: bad host'), msgs.join('|'));
  assert.ok(msgs.includes('제외 셀렉터 1줄: 잘못된 셀렉터: !!'), msgs.join('|'));
  assert.ok(msgs.some((m) => m.startsWith('제외 셀렉터: ')), msgs.join('|'));
  assert.ok(b.errors.every((e) => e.field === 'sites' || e.field === 'excludes'));
  const g = lib.parseGlossaryText('bad line');
  assert.equal(lib.formatError(g.errors[0]), '용어집 1줄: `원문 => 번역` 형식이어야 합니다');
  assert.equal(lib.formatError({ line: 0, message: 'm' }), 'm');
});

test('F24: DeepL engine entry, deepl ref and localhost.parallel merge/validate', async () => {
  assert.ok(lib.ENGINES.some((e) => e.id === 'cloud:deepl'));
  assert.equal(lib.defaults().localhost.parallel, 4);
  assert.equal(lib.mergeSettings({ localhost: { parallel: 3 } }).localhost.parallel, 3);
  assert.equal(lib.mergeSettings({ localhost: { parallel: 9 } }).localhost.parallel, 4);
  assert.equal(lib.mergeSettings({ localhost: { parallel: 0 } }).localhost.parallel, 1);
  assert.equal(lib.mergeSettings({ localhost: { parallel: 'x' } }).localhost.parallel, 4);
  assert.deepEqual(lib.mergeSettings({ deepl: { apiKeyRef: 'x', deeplKey: 'secret' } }).deepl, { apiKeyRef: 'local' });
  assert.equal(lib.mergeSettings({ engine: { default: 'cloud:deepl' } }).engine.default, 'cloud:deepl');
  assert.equal(lib.validateLocalhost({ baseUrl: 'http://127.0.0.1:1', kind: 'ollama', parallel: 5 }).length, 1);
  assert.equal(lib.validateLocalhost({ baseUrl: 'http://127.0.0.1:1', kind: 'ollama', parallel: 2 }).length, 0);
  assert.equal(lib.validateDeeplKey(''), '');
  assert.equal(lib.validateDeeplKey('abcd1234-ef56:fx'), '');
  assert.notEqual(lib.validateDeeplKey('bad key\nx'), '');
});

test('F24: options page keeps the DeepL key in storage.local only (static check)', async () => {
  const fs = await import('node:fs');
  const { ROOT } = await import('./ui-helpers.mjs');
  const js = fs.readFileSync(`${ROOT}/extension/options/options.js`, 'utf8');
  const html = fs.readFileSync(`${ROOT}/extension/options/options.html`, 'utf8');
  assert.match(html, /id="deepl-key" type="password"/);
  assert.match(html, /id="lh-parallel" type="number" min="1" max="4"/);
  assert.match(js, /storage\.local\.set\(\{ deeplKey \}\)/);
  assert.ok(!/storage\.sync\.set\([^)]*deeplKey/.test(js));
  assert.ok(!/settings\.deepl\s*=|deepl:\s*\{[^}]*deeplKey/.test(js));
});
