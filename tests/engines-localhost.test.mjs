import test from 'node:test';
import assert from 'node:assert'; // loose: vm 컨텍스트 객체는 프로토타입이 달라 strict deepEqual 불가
import { loadEngines, mockFetch, chatReply, B, t, x } from './engines-load.mjs';

const E = loadEngines();
const sleep = async () => {};
const S = (baseUrl, model = 'm') => ({ localhost: { baseUrl, model } });
const blocks = [B('a', t(0, 'Hello'), t(1, ' world'))];
const good = JSON.stringify({ blocks: [{ id: 'a', t: { 0: '안녕', 1: ' 세상' } }] });

test('validateBaseUrl accepts loopback only', () => {
  for (const u of ['http://localhost:11434', 'http://127.0.0.1:8080/', 'http://[::1]:8080', 'http://LOCALHOST']) {
    assert.doesNotThrow(() => E.validateBaseUrl(u), u);
  }
  for (const u of [
    'http://localhost.evil.com', 'http://127.0.0.1.evil.com', 'http://evil.com', 'http://127.0.0.1@evil.com',
    'http://evil.com@127.0.0.1', 'http://localhost:x@evil.com', 'http://user:pw@localhost', 'http://evil.com#@127.0.0.1',
    'http://evil.com\\@127.0.0.1', 'file:///etc/passwd', 'ftp://localhost', 'localhost', '', 'http://0.0.0.0', 'http://[::2]',
  ]) {
    assert.throws(() => E.validateBaseUrl(u), { code: 'engine_unavailable' }, u);
  }
});

test('rejected baseUrl never reaches fetch', async () => {
  const f = mockFetch(() => chatReply(good));
  for (const eng of [E.createLlmEngine('ollama', { fetch: f }), E.createLlmEngine('mlx', { fetch: f }), E.createCt2Engine({ fetch: f })]) {
    await assert.rejects(eng.translate(blocks, {}, 'en', S('http://localhost.evil.com')), { code: 'engine_unavailable' });
    // status() uses default loopback base, so it does call fetch with 127.0.0.1
  }
  assert.equal(f.calls.length, 0);
});

test('llm: request shape, parse, slots', async () => {
  const f = mockFetch(() => chatReply('```json\n' + good + '\n```'));
  const eng = E.createLlmEngine('ollama', { fetch: f, sleep });
  const out = await eng.translate(blocks, { title: 'T', host: 'h' }, 'en', S('http://127.0.0.1:11434', 'qwen3:8b'));
  assert.deepEqual(out.get('a'), { 0: '안녕', 1: ' 세상' });
  const c = f.calls[0];
  assert.equal(c.url, 'http://127.0.0.1:11434/v1/chat/completions');
  assert.equal(c.body.temperature, 0.2);
  assert.equal(c.body.model, 'qwen3:8b');
  assert.deepEqual(c.body.response_format, { type: 'json_object' });
  assert.ok(c.body.messages[1].content.endsWith('/no_think'));
  assert.equal(c.init.redirect, 'error');
});

test('llm: one retry on bad JSON then bad_response', async () => {
  let n = 0;
  const f = mockFetch(() => chatReply(++n === 1 ? 'sorry, cannot' : good));
  const eng = E.createLlmEngine('mlx', { fetch: f, sleep });
  const out = await eng.translate(blocks, {}, 'en', S('http://localhost:8080'));
  assert.equal(n, 2);
  assert.ok(out.has('a'));
  const f2 = mockFetch(() => chatReply('nope'));
  await assert.rejects(E.createLlmEngine('mlx', { fetch: f2, sleep }).translate(blocks, {}, 'en', S('http://localhost:8080')), { code: 'bad_response' });
  assert.equal(f2.calls.length, 2);
});

test('llm: missing model, partial slots', async () => {
  const eng = E.createLlmEngine('ollama', { fetch: mockFetch(() => chatReply(good)), sleep });
  await assert.rejects(eng.translate(blocks, {}, 'en', S('http://127.0.0.1:11434', '')), { code: 'engine_unavailable' });
  const f = mockFetch(() => chatReply('{"blocks":[{"id":"a","t":{"0":"안녕"}}]}'));
  const out = await E.createLlmEngine('ollama', { fetch: f, sleep }).translate(blocks, {}, 'en', S('http://127.0.0.1:11434'));
  assert.deepEqual(out.get('a'), { 0: '안녕' });
});

test('http: 429/5xx backoff twice, 400 drops response_format, auth no retry, timeout', async () => {
  let n = 0;
  const sleeps = [];
  const f = mockFetch(() => (++n < 3 ? { status: n === 1 ? 429 : 503, body: 'x' } : chatReply(good)));
  const eng = E.createLlmEngine('ollama', { fetch: f, sleep: async (ms) => { sleeps.push(ms); } });
  assert.ok((await eng.translate(blocks, {}, 'en', S('http://127.0.0.1:11434'))).has('a'));
  assert.equal(n, 3); assert.equal(sleeps.length, 2);

  const f429 = mockFetch(() => ({ status: 429, body: '' }));
  await assert.rejects(E.createLlmEngine('mlx', { fetch: f429, sleep }).translate(blocks, {}, 'en', S('http://127.0.0.1:8080')), { code: 'rate_limited' });
  assert.equal(f429.calls.length, 3);

  const f400 = mockFetch((u, i, k) => (JSON.parse(i.body).response_format ? { status: 400, body: 'no' } : chatReply(good)));
  assert.ok((await E.createLlmEngine('ollama', { fetch: f400, sleep }).translate(blocks, {}, 'en', S('http://127.0.0.1:11434'))).has('a'));
  assert.equal(f400.calls.length, 2);

  const f401 = mockFetch(() => ({ status: 401, body: '' }));
  await assert.rejects(E.createLlmEngine('mlx', { fetch: f401, sleep }).translate(blocks, {}, 'en', S('http://127.0.0.1:8080')), { code: 'engine_unavailable' });
  assert.equal(f401.calls.length, 1);

  const fHang = (url, init) => new Promise((_, rej) => init.signal.addEventListener('abort', () => rej(new Error('abort'))));
  await assert.rejects(E.createLlmEngine('mlx', { fetch: fHang, sleep, timeoutMs: 10 }).translate(blocks, {}, 'en', S('http://127.0.0.1:8080')), { code: 'timeout' });
  const fDown = async () => { throw new TypeError('fetch failed'); };
  await assert.rejects(E.createLlmEngine('mlx', { fetch: fDown, sleep }).translate(blocks, {}, 'en', S('http://127.0.0.1:8080')), { code: 'engine_unavailable' });
});

test('ct2: run-splitting at x boundaries', async () => {
  const bs = [
    B('a', t(0, 'Click '), t(1, 'now, '), x('here'), t(2, ' to continue')),
    B('b', t(0, '  123  ')),
    B('c', x('only code')),
  ];
  const f = mockFetch((u, i) => ({ body: { translations: JSON.parse(i.body).texts.map((s) => `KO(${s})`) } }));
  const eng = E.createCt2Engine({ fetch: f, sleep });
  const out = await eng.translate(bs, {}, 'en', S('http://127.0.0.1:8765'));
  assert.equal(f.calls[0].url, 'http://127.0.0.1:8765/translate');
  assert.deepEqual(f.calls[0].body, { src: 'en', tgt: 'ko', texts: ['Click now,', 'to continue'] });
  assert.deepEqual(out.get('a'), { 0: 'KO(Click now,) ', 1: '', 2: ' KO(to continue)' });
  assert.deepEqual(out.get('b'), { 0: '  123  ' }); // no letters: kept as-is
  assert.equal(out.has('c'), false);
});

test('ct2: zh src, length mismatch, bad base', async () => {
  const zb = [{ id: 'z', lang: 'zh-Hant', items: [t(0, '你好')] }];
  const f = mockFetch(() => ({ body: { translations: ['안녕'] } }));
  await E.createCt2Engine({ fetch: f, sleep }).translate(zb, {}, 'zh', S('http://[::1]:8765'));
  assert.equal(f.calls[0].body.src, 'zh-Hant');
  assert.equal(f.calls[0].url, 'http://[::1]:8765/translate');
  const fBad = mockFetch(() => ({ body: { translations: [] } }));
  await assert.rejects(E.createCt2Engine({ fetch: fBad, sleep }).translate(zb, {}, 'zh', S('http://127.0.0.1:8765')), { code: 'bad_response' });
});

test('status: available / down', async () => {
  const up = E.createLlmEngine('ollama', { fetch: mockFetch(() => ({ body: {} })) });
  assert.deepEqual(await up.status(), { available: true });
  const down = E.createCt2Engine({ fetch: async () => { throw new TypeError('x'); }, sleep });
  assert.equal((await down.status()).available, false);
});
