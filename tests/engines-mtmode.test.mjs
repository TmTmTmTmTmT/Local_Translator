import test from 'node:test';
import assert from 'node:assert'; // loose: vm 컨텍스트 객체는 프로토타입이 달라 strict deepEqual 불가
import { loadEngines, mockFetch, B, t, x } from './engines-load.mjs';

const E = loadEngines();
const M = E.mtmode;
const sleep = async () => {};
const S = (baseUrl, model, family, extra) => ({ localhost: Object.assign({ baseUrl, model, family }, extra) });
const ollamaReply = (c) => ({ body: { message: { role: 'assistant', content: c } } });
const completion = (c) => ({ body: { choices: [{ text: c }] } });
const chatReply = (c) => ({ body: { choices: [{ message: { content: c } }] } });

test('prompts: hymt2 en/ja instruction, zh Chinese instruction', () => {
  const en = M.buildMtRequest({ family: 'hymt2', runtime: 'ollama', srcLang: 'en', text: 'Hi' });
  assert.equal(en.messages.length, 1);
  assert.equal(en.messages[0].content, 'Translate the following text into Korean. Note that you should only output the translated result without any additional explanation:\n\nHi');
  assert.equal(M.buildMtRequest({ family: 'hymt2', runtime: 'mlx', srcLang: 'ja', text: 'こんにちは' }).messages[0].content, en.messages[0].content.replace('Hi', 'こんにちは'));
  for (const z of ['zh-Hans', 'zh-Hant']) {
    assert.equal(M.buildMtRequest({ family: 'hymt2', runtime: 'ollama', srcLang: z, text: '你好' }).messages[0].content,
      '将以下文本翻译为韩语，注意只需要输出翻译后的结果，不要额外解释：\n\n你好');
  }
});

test('prompts: translategemma template, mlx raw prompt vs ollama message', () => {
  const user = 'You are a professional English (en) to Korean (ko) translator. Your goal is to accurately convey the meaning and nuances of the original English text while adhering to Korean grammar, vocabulary, and cultural sensitivities.\n'
    + 'Produce only the Korean translation, without any additional explanations or commentary. Please translate the following English text into Korean:\n\n\nHello';
  assert.equal(M.buildMtRequest({ family: 'translategemma', runtime: 'ollama', srcLang: 'en', text: ' Hello ' }).messages[0].content, user);
  const raw = M.buildMtRequest({ family: 'translategemma', runtime: 'mlx', srcLang: 'en', text: 'Hello' });
  assert.equal(raw.prompt, `<start_of_turn>user\n${user}<end_of_turn>\n<start_of_turn>model\n`);
  assert.deepEqual(raw.stop, ['<end_of_turn>']);
  assert.match(M.buildMtRequest({ family: 'translategemma', runtime: 'ollama', srcLang: 'zh-Hant', text: 'x' }).messages[0].content, /Chinese \(zh-Hant\) to Korean/);
});

test('prompts: chat family system has markers rule, lang note, no_think suffix', () => {
  const r = M.buildMtRequest({ family: 'chat', runtime: 'mlx', srcLang: 'ja', text: 'A⟦1⟧B', userSuffix: '/no_think' });
  assert.equal(r.messages[0].role, 'system');
  assert.match(r.messages[0].content, /⟦1⟧/);
  assert.match(r.messages[0].content, /일본어 보충/);
  assert.equal(r.messages[1].content, 'A⟦1⟧B\n/no_think');
  assert.doesNotMatch(M.buildMtRequest({ family: 'chat', runtime: 'mlx', srcLang: 'en', text: 'a' }).messages[0].content, /보충/);
  assert.throws(() => M.buildMtRequest({ family: 'nope', runtime: 'mlx', srcLang: 'en', text: 'a' }), { code: 'engine_unavailable' });
  assert.throws(() => M.buildMtRequest({ family: 'chat', runtime: 'mlx', srcLang: 'fr', text: 'a' }), { code: 'unsupported_lang' });
});

test('splitAtMarkers: strict order/count, tolerant spacing', () => {
  assert.deepEqual([...M.splitAtMarkers('가⟦1⟧나⟦ 2 ⟧다', 2).pieces], ['가', '나', '다']);
  for (const bad of ['가⟦2⟧나⟦1⟧다', '가⟦1⟧나', '가⟦1⟧나⟦1⟧다', '가⟦1⟧나⟦2⟧다⟦3⟧라']) assert.equal(M.splitAtMarkers(bad, 2).ok, false, bad);
});

const ollama = (f) => E.createMtEngine('ollama', { fetch: f, sleep });
const mlx = (f) => E.createMtEngine('mlx', { fetch: f, sleep });
const markerBlock = B('a', t(0, 'Click '), x('here'), t(1, ' to continue'));

test('marker path: one request, outer whitespace kept, x slot omitted', async () => {
  const f = mockFetch(() => ollamaReply('계속하려면 ⟦1⟧을 클릭하세요'));
  const out = await ollama(f).translate([B('a', t(0, ' Click '), x('here'), t(1, ' to continue '))], {}, 'en', S('http://127.0.0.1:11434', 'hy-mt2:1.8b', 'hymt2'));
  assert.equal(f.calls.length, 1);
  assert.deepEqual(out.get('a'), { 0: ' 계속하려면 ', 1: '을 클릭하세요 ' });
  assert.match(f.calls[0].body.messages[0].content, /Click ⟦1⟧ to continue$/);
});

test('fallback: missing marker -> run-splitting, one request per run', async () => {
  let n = 0;
  const replies = ['계속하려면 클릭하세요', 'KO1', 'KO2'];
  const f = mockFetch(() => ollamaReply(replies[n++]));
  const out = await ollama(f).translate([markerBlock], {}, 'en', S('http://127.0.0.1:11434', 'm', 'hymt2'));
  assert.equal(f.calls.length, 3);
  assert.deepEqual(out.get('a'), { 0: 'KO1 ', 1: ' KO2' });
});

test('fallback: markers in source text skip marker path', async () => {
  const f = mockFetch((u, i, k) => ollamaReply(`KO${k}`));
  const out = await ollama(f).translate([B('a', t(0, 'see ⟦1⟧ '), x('c'), t(1, ' end'))], {}, 'en', S('http://127.0.0.1:11434', 'm', 'chat'));
  assert.equal(f.calls.length, 2);
  assert.ok(out.has('a'));
});

test('plain block, passthrough block, x-only block, serial requests', async () => {
  const f = mockFetch(() => ollamaReply('```\n안녕 세상\n```'));
  const bs = [B('p', t(0, '  Hello world ')), B('n', t(0, ' 123 ')), B('c', x('code'))];
  const out = await ollama(f).translate(bs, {}, 'en', S('http://127.0.0.1:11434', 'm', 'hymt2'));
  assert.equal(f.calls.length, 1);
  assert.deepEqual(out.get('p'), { 0: '  안녕 세상 ' });
  assert.deepEqual(out.get('n'), { 0: ' 123 ' });
  assert.equal(out.has('c'), false);
});

test('block lang zh-Hant selects Chinese instruction; engine zh default zh-Hans', async () => {
  const f = mockFetch(() => ollamaReply('안녕'));
  await ollama(f).translate([{ id: 'z', lang: 'zh-Hant', items: [t(0, '你好')] }], {}, 'zh', S('http://127.0.0.1:11434', 'm', 'hymt2'));
  assert.match(f.calls[0].body.messages[0].content, /^将以下文本翻译为韩语/);
  const f2 = mockFetch(() => ollamaReply('안녕'));
  await ollama(f2).translate([{ id: 'z', items: [t(0, '你好')] }], {}, 'zh', S('http://127.0.0.1:11434', 'm', 'translategemma'));
  assert.match(f2.calls[0].body.messages[0].content, /Chinese \(zh-Hans\)/);
});

test('ollama request shape: /api/chat, keep_alive default 300 and override, sampling', async () => {
  const f = mockFetch(() => ollamaReply('안녕'));
  await ollama(f).translate([B('a', t(0, 'Hello'))], {}, 'en', S('http://127.0.0.1:11434', 'hy-mt2', 'hymt2'));
  const c = f.calls[0];
  assert.equal(c.url, 'http://127.0.0.1:11434/api/chat');
  assert.equal(c.body.model, 'hy-mt2');
  assert.equal(c.body.stream, false);
  assert.equal(c.body.keep_alive, 300);
  assert.equal(c.body.options.temperature, 0.7);
  assert.equal(c.body.options.repeat_penalty, 1.05);
  assert.equal(c.init.redirect, 'error');
  const f2 = mockFetch(() => ollamaReply('안녕'));
  await ollama(f2).translate([B('a', t(0, 'Hello'))], {}, 'en', S('http://127.0.0.1:11434', 'm', 'chat', { keepAlive: 0 }));
  assert.equal(f2.calls[0].body.keep_alive, 0);
  assert.equal(f2.calls[0].body.options.top_k, undefined);
});

test('mlx: translategemma raw /v1/completions with stop; others chat completions with default_model', async () => {
  const f = mockFetch(() => completion('안녕'));
  const out = await mlx(f).translate([B('a', t(0, 'Hello'))], {}, 'en', S('http://127.0.0.1:8080', '', 'translategemma'));
  assert.deepEqual(out.get('a'), { 0: '안녕' });
  const c = f.calls[0];
  assert.equal(c.url, 'http://127.0.0.1:8080/v1/completions');
  assert.equal(c.body.model, 'default_model');
  assert.deepEqual(c.body.stop, ['<end_of_turn>']);
  assert.match(c.body.prompt, /^<start_of_turn>user\nYou are a professional English/);
  assert.equal(c.body.top_k, 64);

  const f2 = mockFetch(() => chatReply('안녕'));
  await mlx(f2).translate([B('a', t(0, 'Hello'))], {}, 'en', S('http://127.0.0.1:8080', 'x', 'hymt2'));
  assert.equal(f2.calls[0].url, 'http://127.0.0.1:8080/v1/chat/completions');
  assert.equal(f2.calls[0].body.model, 'default_model');
  assert.equal(f2.calls[0].body.messages[0].role, 'user');
  assert.equal(f2.calls[0].body.repetition_penalty, 1.05);

  const f3 = mockFetch(() => chatReply('안녕'));
  await mlx(f3).translate([B('a', t(0, 'Hello'))], {}, 'en', S('http://127.0.0.1:8080', 'Qwen3-8B', 'chat'));
  assert.equal(f3.calls[0].body.chat_template_kwargs.enable_thinking, false);
  assert.ok(f3.calls[0].body.messages[1].content.endsWith('/no_think'));
});

test('family falls back to model inference then chat', async () => {
  const f = mockFetch(() => ollamaReply('안녕'));
  await ollama(f).translate([B('a', t(0, 'Hi'))], {}, 'en', S('http://127.0.0.1:11434', 'translategemma:4b', undefined));
  assert.match(f.calls[0].body.messages[0].content, /professional English/);
  const f2 = mockFetch(() => ollamaReply('안녕'));
  await ollama(f2).translate([B('a', t(0, 'Hi'))], {}, 'en', S('http://127.0.0.1:11434', 'llama3', 'bogus'));
  assert.equal(f2.calls[0].body.messages[0].role, 'system');
});

test('errors: missing ollama model, server down aborts batch, empty reply', async () => {
  const f = mockFetch(() => ollamaReply('x'));
  await assert.rejects(ollama(f).translate([B('a', t(0, 'Hi'))], {}, 'en', S('http://127.0.0.1:11434', '', 'hymt2')), { code: 'engine_unavailable' });
  assert.equal(f.calls.length, 0);
  const down = mockFetch(() => { throw new TypeError('fetch failed'); });
  await assert.rejects(ollama(down).translate([B('a', t(0, 'Hi')), B('b', t(0, 'Yo'))], {}, 'en', S('http://127.0.0.1:11434', 'm', 'chat')), { code: 'engine_unavailable' });
  assert.equal(down.calls.length, 1);
  const empty = mockFetch(() => ollamaReply('  '));
  await assert.rejects(ollama(empty).translate([B('a', t(0, 'Hi'))], {}, 'en', S('http://127.0.0.1:11434', 'm', 'chat')), { code: 'bad_response' });
  // partial failure: first block empty, second ok -> Map has only second
  let n = 0;
  const part = mockFetch(() => ollamaReply(++n === 1 ? '' : '안녕'));
  const out = await ollama(part).translate([B('a', t(0, 'Hi')), B('b', t(0, 'Yo'))], {}, 'en', S('http://127.0.0.1:11434', 'm', 'chat'));
  assert.deepEqual([...out.keys()], ['b']);
});

test('loopback security: non-loopback baseUrl never reaches fetch', async () => {
  const f = mockFetch(() => ollamaReply('x'));
  for (const eng of [ollama(f), mlx(f)]) {
    for (const u of ['http://localhost.evil.com', 'http://evil.com', 'http://127.0.0.1@evil.com', 'http://user:pw@localhost', 'file:///etc/passwd']) {
      await assert.rejects(eng.translate([B('a', t(0, 'Hi'))], {}, 'en', S(u, 'm', 'chat')), { code: 'engine_unavailable' }, u);
    }
  }
  assert.equal(f.calls.length, 0);
});

test('status: tags for ollama, models for mlx', async () => {
  const f = mockFetch(() => ({ body: {} }));
  assert.deepEqual(await ollama(f).status(), { available: true });
  assert.equal(f.calls[0].url, 'http://127.0.0.1:11434/api/tags');
  assert.deepEqual(await mlx(f).status(), { available: true });
  assert.equal(f.calls[1].url, 'http://127.0.0.1:8080/v1/models');
  assert.equal((await ollama(async () => { throw new TypeError('x'); }).status()).available, false);
});

test('registry: mt engine instances have ids, concurrency 1', () => {
  const e = E.getEngine('local:mt-mlx', {});
  assert.equal(e.id, 'local:mt-mlx');
  assert.equal(e.concurrency, 1);
  assert.equal(E.getEngine('local:mt-ollama', {}).id, 'local:mt-ollama');
});

test('F20: link-heavy meta line goes straight to run-splitting; sentence with 1-2 links keeps markers', async () => {
  let n = 0;
  const f = mockFetch(() => ollamaReply(`KO${++n}`));
  const hn = B('h', t(0, '17 points by '), x('user'), t(1, ' '), x('55 minutes ago'), t(2, ' | '), x('hide'), t(3, ' | '), x('2 comments'));
  await ollama(f).translate([hn], {}, 'en', S('http://127.0.0.1:11434', 'm', 'hymt2'));
  assert.equal(f.calls.length, 1); // only one translatable run
  assert.ok(!/⟦/.test(f.calls[0].body.messages[0].content));

  const f2 = mockFetch(() => ollamaReply('A ⟦1⟧ B ⟦2⟧ C'));
  const two = B('s', t(0, 'See '), x('a'), t(1, ' and '), x('b'), t(2, ' for details on the matter at hand'));
  await ollama(f2).translate([two], {}, 'en', S('http://127.0.0.1:11434', 'm', 'hymt2'));
  assert.equal(f2.calls.length, 1);
  assert.match(f2.calls[0].body.messages[0].content, /See ⟦1⟧ and ⟦2⟧ for details/);

  const f3 = mockFetch(() => ollamaReply('KO'));
  const shortTwo = B('q', t(0, 'See '), x('a'), t(1, ' and '), x('b'));
  await ollama(f3).translate([shortTwo], {}, 'en', S('http://127.0.0.1:11434', 'm', 'hymt2'));
  assert.equal(f3.calls.length, 2); // "See", "and" -> 2 requests, no markers
});
