import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sites = require('../extension/lib/sites.js');
const hash = require('../extension/lib/hash.js');

test('normalizeHost', () => {
  assert.equal(sites.normalizeHost('HTTPS://Example.COM:8080/a/b?q=1#x'), 'example.com');
  assert.equal(sites.normalizeHost('example.com.'), 'example.com');
  assert.equal(sites.normalizeHost('www.Example.com'), 'www.example.com');
});

test('parseHostList text/array, dedupe, comments', () => {
  assert.deepEqual(sites.parseHostList('a.com\n\n# c\nB.com # x\na.com\r\nhttps://c.org/p'), ['a.com', 'b.com', 'c.org']);
  assert.deepEqual(sites.parseHostList([{ host: 'a.com', exclude: '' }, 'b.com']), ['a.com', 'b.com']);
});

test('hostMatches subdomain vs exact', () => {
  assert.ok(sites.hostMatches('example.com', 'example.com'));
  assert.ok(sites.hostMatches('a.b.example.com', 'example.com'));
  assert.ok(!sites.hostMatches('notexample.com', 'example.com'));
  assert.ok(sites.hostMatches('docs.example.com', 'docs.example.com'));
  assert.ok(sites.hostMatches('x.docs.example.com', 'docs.example.com'));
  assert.ok(!sites.hostMatches('example.com', 'docs.example.com'));
  assert.ok(!sites.hostMatches('www.example.com', 'docs.example.com'));
});

test('toMatchPatterns', () => {
  assert.deepEqual(sites.toMatchPatterns(['example.com']), ['*://example.com/*', '*://*.example.com/*']);
  assert.deepEqual(sites.toMatchPatterns('a.com\nb.com'), ['*://a.com/*', '*://*.a.com/*', '*://b.com/*', '*://*.b.com/*']);
});

test('isSiteEnabled', () => {
  const s = { enabled: true, sites: [{ host: 'example.com', exclude: '' }] };
  assert.ok(sites.isSiteEnabled(s, 'en.example.com'));
  assert.ok(!sites.isSiteEnabled(s, 'other.com'));
  assert.ok(!sites.isSiteEnabled({ ...s, enabled: false }, 'example.com'));
  assert.ok(!sites.isSiteEnabled(null, 'example.com'));
});

test('fnv1a64Hex known values and determinism', () => {
  assert.equal(hash.fnv1a64Hex(''), 'cbf29ce484222325');
  assert.equal(hash.fnv1a64Hex('a'), 'af63dc4c8601ec8c');
  assert.equal(hash.fnv1a64Hex('한국어'), hash.fnv1a64Hex('한국어'));
  assert.notEqual(hash.fnv1a64Hex('abc'), hash.fnv1a64Hex('abd'));
});

test('cacheKey differs by engine/model/items', () => {
  const items = [{ k: 't', i: 0, text: 'Hello' }];
  const k = hash.cacheKey('e1', 'm', items);
  assert.equal(k, hash.cacheKey('e1', 'm', items));
  assert.notEqual(k, hash.cacheKey('e2', 'm', items));
  assert.notEqual(k, hash.cacheKey('e1', 'm2', items));
  assert.notEqual(k, hash.cacheKey('e1', 'm', [{ k: 't', i: 0, text: 'Hellp' }]));
  assert.match(k, /^[0-9a-f]{16}$/);
});
