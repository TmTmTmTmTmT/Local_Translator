import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEngines, B, t, x } from './engines-load.mjs';

const KEY = 'abcd1234-ef56-7890:fx';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// DeepL-like fetch: handler(payload, headers, url, n) -> {status?, translations?}
function deeplFetch(handler) {
  const calls = [];
  const fn = async (url, init) => {
    const payload = JSON.parse(init.body);
    calls.push({ url, init, payload });
    const r = await handler(payload, init.headers, url, calls.length);
    const status = r.status || 200;
    const text = JSON.stringify(r.body || { translations: r.translations.map((s) => ({ detected_source_language: 'EN', text: s })) });
    return { ok: status < 300, status, text: async () => text };
  };
  fn.calls = calls;
  return fn;
}
const mk = (E, fetch, extra) => E.createDeeplEngine(Object.assign({ fetch, getKey: async () => KEY, sleep: async () => {} }, extra));

test('request format: KO target, source_lang, xml tags, auth header, free endpoint', async () => {
  const E = loadEngines();
  const f = deeplFetch((p) => ({ translations: p.text.map((s) => s.replace('Hello', 'K1').replace('world', 'K2')) }));
  const eng = mk(E, f);
  const blocks = [B('a', t(0, 'Hello & '), x('link <b>'), t(1, ' world')), B('b', t(0, 'plain'))];
  const out = await eng.translate(blocks, {}, 'en', {});
  const c = f.calls[0];
  assert.equal(c.url, 'https://api-free.deepl.com/v2/translate');
  assert.equal(c.init.headers.authorization, `DeepL-Auth-Key ${KEY}`);
  assert.deepEqual(c.payload, {
    text: ['Hello &amp; <x i="0">link &lt;b&gt;</x> world', 'plain'],
    target_lang: 'KO', source_lang: 'EN', preserve_formatting: true, tag_handling: 'xml', ignore_tags: ['x'],
  });
  assert.equal(out.get('a')['0'], 'K1 & ');
  assert.equal(out.get('a')['1'], ' K2');
  assert.equal(eng.id, 'cloud:deepl');
});

test('pro endpoint for non-fx key; ja/zh source_lang', async () => {
  const E = loadEngines();
  const f = deeplFetch((p) => ({ translations: p.text.map(() => 'ok') }));
  const eng = E.createDeeplEngine({ fetch: f, getKey: async () => 'abcd1234-ef56-7890' });
  await eng.translate([B('a', t(0, 'x text'))], {}, 'zh-Hans', {});
  assert.equal(f.calls[0].url, 'https://api.deepl.com/v2/translate');
  assert.equal(f.calls[0].payload.source_lang, 'ZH');
  await eng.translate([B('a', t(0, 'x text'))], {}, 'ja', {});
  assert.equal(f.calls[1].payload.source_lang, 'JA');
});

test('response split by x tags distributes t slots', async () => {
  const E = loadEngines();
  const f = deeplFetch(() => ({ translations: ['A &amp; B <x i="0">l1</x> C <x i="1"/> D'] }));
  const eng = mk(E, f);
  const out = await eng.translate([B('a', t(0, 'one '), x('l1'), t(1, ' two '), x('l2'), t(2, ' three'))], {}, 'en', {});
  assert.deepEqual({ ...out.get('a') }, { 0: 'A & B ', 1: ' C ', 2: ' D' });
  assert.equal(f.calls.length, 1);
});

test('tag count/order mismatch falls back to per-segment plain requests', async () => {
  const E = loadEngines();
  const f = deeplFetch((p) => (p.tag_handling
    ? { translations: ['no tags here'] }
    : { translations: p.text.map((s) => `T(${s})`) }));
  const eng = mk(E, f);
  const out = await eng.translate([B('a', t(0, 'before '), x('lnk'), t(1, ' after'))], {}, 'en', {});
  assert.equal(f.calls.length, 2);
  assert.equal(f.calls[1].payload.tag_handling, undefined);
  assert.deepEqual(f.calls[1].payload.text, ['before', 'after']);
  assert.equal(out.get('a')['0'], 'T(before) ');
  assert.equal(out.get('a')['1'], ' T(after)');
});

test('non-linguistic blocks are not sent; batches split at 50 texts', async () => {
  const E = loadEngines();
  const f = deeplFetch((p) => ({ translations: p.text.map((s) => 'K') }));
  const eng = mk(E, f);
  const many = Array.from({ length: 120 }, (_, k) => B('b' + k, t(0, 'word ' + k)));
  many.push(B('num', t(0, '12345')));
  const out = await eng.translate(many, {}, 'en', {});
  assert.deepEqual(f.calls.map((c) => c.payload.text.length), [50, 50, 20]);
  assert.equal(out.get('num')['0'], '12345');
});

test('error mapping: 403/401 key, 456 quota, 429 retry then rate_limited, 5xx', async () => {
  const E = loadEngines();
  const blocks = [B('a', t(0, 'Hello there'))];
  for (const s of [401, 403]) {
    const f = deeplFetch(() => ({ status: s, body: {} }));
    await assert.rejects(mk(E, f).translate(blocks, {}, 'en', {}), (e) => e.code === 'engine_unavailable' && /key/i.test(e.message) && !e.message.includes(KEY));
    assert.equal(f.calls.length, 1);
  }
  let f = deeplFetch(() => ({ status: 456, body: {} }));
  await assert.rejects(mk(E, f).translate(blocks, {}, 'en', {}), (e) => e.code === 'rate_limited');
  assert.equal(f.calls.length, 1);
  f = deeplFetch(() => ({ status: 429, body: {} }));
  await assert.rejects(mk(E, f).translate(blocks, {}, 'en', {}), (e) => e.code === 'rate_limited');
  assert.equal(f.calls.length, 3);
  f = deeplFetch(() => ({ status: 503, body: {} }));
  await assert.rejects(mk(E, f).translate(blocks, {}, 'en', {}), (e) => e.code === 'engine_unavailable');
});

test('missing or malformed key is engine_unavailable and nothing is sent', async () => {
  const E = loadEngines();
  const f = deeplFetch(() => ({ translations: [] }));
  for (const key of ['', 'bad key', 'k\r\nX: y1234567']) {
    const eng = E.createDeeplEngine({ fetch: f, getKey: async () => key });
    await assert.rejects(eng.translate([B('a', t(0, 'Hello'))], {}, 'en', {}), (e) => e.code === 'engine_unavailable');
    assert.equal((await eng.status()).available, false);
  }
  assert.equal(f.calls.length, 0);
});

test('fetch TypeError falls back to native https http message, then sticks to native', async () => {
  const E = loadEngines();
  let fetches = 0;
  const fetch = async () => { fetches++; throw new TypeError('Load failed'); };
  const sent = [];
  const send = async (id, msg) => {
    sent.push(msg);
    const p = JSON.parse(msg.body);
    return { ok: true, status: 200, body: JSON.stringify({ translations: p.text.map(() => ({ text: 'N' })) }) };
  };
  const eng = E.createDeeplEngine({ fetch, send, getKey: async () => KEY, sleep: async () => {} });
  const out = await eng.translate([B('a', t(0, 'Hello there'))], {}, 'en', {});
  assert.equal(out.get('a')['0'], 'N');
  assert.equal(sent[0].type, 'http');
  assert.equal(sent[0].method, 'POST');
  assert.equal(sent[0].url, 'https://api-free.deepl.com/v2/translate');
  assert.equal(sent[0].headers.authorization, `DeepL-Auth-Key ${KEY}`);
  await eng.translate([B('a', t(0, 'Hello again'))], {}, 'en', {});
  assert.equal(fetches, 1);
  assert.equal(sent.length, 2);
});

test('native failure maps to engine_unavailable without leaking the key', async () => {
  const E = loadEngines();
  const fetch = async () => { throw new TypeError('x'); };
  const send = async () => ({ ok: false, error: { code: 'bad_response', message: `target not allowed ${KEY}` } });
  const eng = E.createDeeplEngine({ fetch, send, getKey: async () => KEY });
  await assert.rejects(eng.translate([B('a', t(0, 'Hello'))], {}, 'en', {}), (e) => e.code === 'engine_unavailable' && !JSON.stringify(e).includes(KEY));
});

test('registry exposes cloud:deepl for en/ja/zh; engine/background never touch storage.sync or log the key', () => {
  const E = loadEngines();
  assert.ok(E.listEngines().some((e) => e.id === 'cloud:deepl' && e.kind === 'cloud'));
  assert.equal(E.supportsLang('cloud:deepl', 'zh-Hant'), true);
  const src = fs.readFileSync(path.join(root, 'extension/engines/deepl.js'), 'utf8');
  assert.ok(!/storage\.sync/.test(src));
  assert.ok(!/console\./.test(src));
  const bg = fs.readFileSync(path.join(root, 'extension/background.js'), 'utf8');
  assert.ok(!/deeplKey/.test(bg));
  for (const f of fs.readdirSync(path.join(root, 'extension/content'))) {
    assert.ok(!/deepl/i.test(fs.readFileSync(path.join(root, 'extension/content', f), 'utf8')), f);
  }
});
