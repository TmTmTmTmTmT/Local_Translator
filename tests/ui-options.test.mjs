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
