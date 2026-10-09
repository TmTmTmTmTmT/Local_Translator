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
  await assert.rejects(mk(E, f).translate(blocks, {}, 'en', {}), (e) => e.code === 'rate_limited' && e.status === 429);
  assert.equal(f.calls.length, 6); // F25: 1 + 5 retries
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

// ---- F25 ----
function vclock() {
  const c = { t: 0, sleeps: [] };
  c.now = () => c.t;
  c.sleep = async (ms) => { c.sleeps.push(ms); c.t += ms; };
  return c;
}
const okBody = (p) => ({ translations: p.text.map((s) => ({ detected_source_language: 'EN', text: s })) });
function seqFetch(clock, handler) {
  const calls = [];
  const fn = async (url, init) => {
    const payload = JSON.parse(init.body);
    calls.push({ at: clock.t, payload });
    const r = await handler(payload, calls.length);
    const status = r.status || 200;
    const text = JSON.stringify(r.body || okBody(payload));
    const headers = { get: (k) => (r.headers ? r.headers[k.toLowerCase()] : null) };
    return { ok: status < 300, status, headers, text: async () => text };
  };
  fn.calls = calls;
  return fn;
}
const mkc = (E, f, clock, extra) => E.createDeeplEngine(Object.assign({ fetch: f, getKey: async () => KEY, sleep: clock.sleep, now: clock.now, minIntervalMs: 0 }, extra));

test('F25: 429 repeated then success uses exponential backoff 1,2,4 s', async () => {
  const E = loadEngines();
  const clock = vclock();
  const f = seqFetch(clock, (p, n) => (n <= 3 ? { status: 429, body: {} } : {}));
  const out = await mkc(E, f, clock).translate([B('a', t(0, 'Hello there'))], {}, 'en', {});
  assert.equal(out.get('a')['0'], 'Hello there');
  assert.equal(f.calls.length, 4);
  assert.deepEqual(clock.sleeps, [1000, 2000, 4000]);
});

test('F25: Retry-After header wins over backoff and is capped at 30 s', async () => {
  const E = loadEngines();
  let clock = vclock();
  let f = seqFetch(clock, (p, n) => (n === 1 ? { status: 429, body: {}, headers: { 'retry-after': '7' } } : {}));
  await mkc(E, f, clock).translate([B('a', t(0, 'Hello there'))], {}, 'en', {});
  assert.deepEqual(clock.sleeps, [7000]);
  clock = vclock();
  f = seqFetch(clock, (p, n) => (n === 1 ? { status: 429, body: {}, headers: { 'retry-after': '600' } } : {}));
  await mkc(E, f, clock).translate([B('a', t(0, 'Hello there'))], {}, 'en', {});
  assert.deepEqual(clock.sleeps, [30000]);
});

test('F25: 456 and 401/403 fail immediately without retry or sleep; error carries status', async () => {
  const E = loadEngines();
  for (const s of [456, 401, 403]) {
    const clock = vclock();
    const f = seqFetch(clock, () => ({ status: s, body: {} }));
    await assert.rejects(mkc(E, f, clock).translate([B('a', t(0, 'Hello there'))], {}, 'en', {}), (e) => e.status === s);
    assert.equal(f.calls.length, 1);
    assert.deepEqual(clock.sleeps, []);
  }
});

test('F25: a 429 sets an engine-wide cooldown that holds concurrent requests', async () => {
  const E = loadEngines();
  const clock = vclock();
  const f = seqFetch(clock, (p, n) => (n === 1 ? { status: 429, body: {} } : {}));
  let eng;
  let p2 = null;
  const sleep = async (ms) => {
    if (!p2) p2 = eng.translate([B('b', t(0, 'Second block'))], {}, 'en', {}); // second request arrives during the cooldown
    await clock.sleep(ms);
  };
  eng = mkc(E, f, clock, { sleep });
  await Promise.all([eng.translate([B('a', t(0, 'First block'))], {}, 'en', {}), (async () => { while (!p2) await new Promise((r) => setTimeout(r, 1)); return p2; })()]);
  assert.equal(f.calls.length, 3);
  assert.equal(f.calls[0].at, 0);
  assert.ok(f.calls[1].at >= 1000 && f.calls[2].at >= 1000, 'no request starts during the cooldown');
});

test('F25: request starts are spaced by the minimum interval', async () => {
  const E = loadEngines();
  const clock = vclock();
  const starts = [];
  const f = seqFetch(clock, () => { starts.push(Date.now()); return {}; });
  // real clock and real sleep: concurrent callers must be serialized by the start-slot reservation
  const eng = E.createDeeplEngine({ fetch: f, getKey: async () => KEY, minIntervalMs: 60 });
  await Promise.all([1, 2, 3].map((i) => eng.translate([B('b' + i, t(0, 'Block ' + i))], {}, 'en', {})));
  starts.sort((a, b) => a - b);
  assert.ok(starts[1] - starts[0] >= 50 && starts[2] - starts[1] >= 50, JSON.stringify(starts));
});

test('F25: network failure is retried with backoff', async () => {
  const E = loadEngines();
  const clock = vclock();
  let n = 0;
  const send = async () => {
    n++;
    if (n <= 2) return { ok: false, error: { code: 'network' } };
    return { ok: true, status: 200, body: JSON.stringify({ translations: [{ text: 'OK' }] }) };
  };
  const f = async () => { throw new Error('cors'); };
  const out = await mkc(E, f, clock, { send }).translate([B('a', t(0, 'Hello there'))], {}, 'en', {});
  assert.equal(out.get('a')['0'], 'OK');
  assert.equal(n, 3);
  assert.deepEqual(clock.sleeps, [1000, 2000]);
});

test('F25: fallback request failure keeps the blocks that already succeeded (partial result)', async () => {
  const E = loadEngines();
  const clock = vclock();
  // block b comes back with a missing x tag -> fallback plain request, which then fails with 400
  const f = seqFetch(clock, (p) => {
    if (p.tag_handling) return { translations: ['A1 ok', 'broken without tag'].map((s) => ({ text: s })), body: { translations: [{ text: 'A1 ok' }, { text: 'broken without tag' }] } };
    return { status: 400, body: {} };
  });
  const blocks = [B('a', t(0, 'Alpha text')), B('b', t(0, 'Bravo '), x('link'), t(1, ' tail'))];
  const out = await mkc(E, f, clock).translate(blocks, {}, 'en', {});
  assert.equal(out.get('a')['0'], 'A1 ok');
  assert.equal(out.has('b'), false);
});

test('F25: nothing succeeded -> the error is thrown with its status', async () => {
  const E = loadEngines();
  const clock = vclock();
  const f = seqFetch(clock, () => ({ status: 400, body: {} }));
  await assert.rejects(mkc(E, f, clock).translate([B('a', t(0, 'Hello there'))], {}, 'en', {}), (e) => e.code === 'bad_response' && e.status === 400);
});

test('F25: whitespace around x items is preserved in the XML ("points by")', async () => {
  const E = loadEngines();
  const clock = vclock();
  const f = seqFetch(clock, () => ({}));
  const blocks = [B('a', x('123 points'), t(0, 'by'), x('someuser'), t(1, '2 hours ago'), x('|'), t(2, 'hide'))];
  await mkc(E, f, clock).translate(blocks, {}, 'en', {});
  assert.equal(f.calls[0].payload.text[0], '<x i="0">123 points</x> by <x i="1">someuser</x> 2 hours ago <x i="2">|</x> hide');
  // already spaced input gains no double spaces
  const g = seqFetch(clock, () => ({}));
  await mkc(E, g, clock).translate([B('a', t(0, 'Go '), x('here'), t(1, ' now'))], {}, 'en', {});
  assert.equal(g.calls[0].payload.text[0], 'Go <x i="0">here</x> now');
});
