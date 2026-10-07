import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMtRequest, hyMtUserText, translateGemmaUserText, splitAtMarkers, makeMtTranslator, mtFamily, planMarkerBlock } from './mtmode.mjs';
import { makeMlxMtChat, makeOllamaMtChat } from '../engines/mtchat.mjs';

const t = (i, text) => ({ k: 't', i, text });
const x = (text) => ({ k: 'x', text });
const link = { id: 'l', items: [t(0, 'Click '), x('here'), t(1, ' to continue.')] };

test('family detection', () => {
  assert.equal(mtFamily('mlx-community/Hy-MT2-1.8B-4bit'), 'hymt');
  assert.equal(mtFamily('translategemma:4b'), 'translategemma');
  assert.equal(mtFamily('qwen3:1.7b'), null);
});

test('Hy-MT2 prompts: English for en/ja, Chinese for zh; chat message only', () => {
  const en = buildMtRequest({ family: 'hymt', runtime: 'mlx', lang: 'en', text: 'Hello' });
  assert.deepEqual(en.messages, [{ role: 'user', content: 'Translate the following text into Korean. Note that you should only output the translated result without any additional explanation:\n\nHello' }]);
  assert.equal(hyMtUserText('ja', 'x').startsWith('Translate the following text into Korean.'), true);
  assert.equal(hyMtUserText('zh-Hans', '你好'), '将以下文本翻译为韩语，注意只需要输出翻译后的结果，不要额外解释：\n\n你好');
});

test('TranslateGemma prompt matches chat_template; mlx => raw prompt without bos, ollama => user message', () => {
  const u = translateGemmaUserText('Japanese', 'ja', '  こんにちは ');
  assert.ok(u.startsWith('You are a professional Japanese (ja) to Korean (ko) translator. Your goal is to accurately convey the meaning and nuances of the original Japanese text while adhering to Korean grammar, vocabulary, and cultural sensitivities.\nProduce only the Korean translation, without any additional explanations or commentary. Please translate the following Japanese text into Korean:\n\n\n'));
  assert.ok(u.endsWith('\n\n\nこんにちは'));
  const m = buildMtRequest({ family: 'translategemma', runtime: 'mlx', lang: 'zh-Hant', text: '你好' });
  assert.equal(m.messages, undefined);
  assert.ok(m.prompt.startsWith('<start_of_turn>user\nYou are a professional Chinese (zh-Hant) to Korean (ko)'));
  assert.ok(m.prompt.endsWith('你好<end_of_turn>\n<start_of_turn>model\n'));
  assert.ok(!m.prompt.includes('<bos>'));
  const o = buildMtRequest({ family: 'translategemma', runtime: 'ollama', lang: 'en', text: 'Hi' });
  assert.equal(o.messages[0].role, 'user');
  assert.ok(o.messages[0].content.includes('English (en) to Korean (ko)'));
});

test('splitAtMarkers: exact once, in order', () => {
  assert.deepEqual(splitAtMarkers('a ⟦1⟧ b ⟦2⟧ c', 2), { ok: true, pieces: ['a ', ' b ', ' c'] });
  assert.equal(splitAtMarkers('a ⟦1⟧ ⟦1⟧ b', 2).ok, false);
  assert.equal(splitAtMarkers('a ⟦2⟧ b ⟦1⟧', 2).ok, false);
  assert.equal(splitAtMarkers('a b', 1).ok, false);
  assert.equal(splitAtMarkers('a ⟦ 1 ⟧ b', 1).ok, true);
});

const fake = (replies, log = []) => async ({ request }) => {
  const text = request.messages ? request.messages[0].content : request.prompt;
  log.push(text);
  const r = replies.shift();
  return typeof r === 'function' ? r(text) : r;
};

test('x block: one request with markers, split to slots', async () => {
  const log = [];
  const tr = makeMtTranslator({ chat: fake(['계속하려면 ⟦1⟧을 클릭하세요.'], log), family: 'hymt', runtime: 'mlx' });
  const { blocks } = await tr({ batch: [link], lang: 'en' });
  assert.equal(log.length, 1);
  assert.ok(log[0].endsWith('Click ⟦1⟧ to continue.'));
  assert.deepEqual(blocks[0].slots, { 0: '계속하려면 ', 1: '을 클릭하세요.' });
  assert.equal(tr.stats.markerBlocks, 1);
});

test('missing/duplicated markers => run-splitting fallback (one request per run)', async () => {
  for (const bad of ['계속하려면 클릭하세요.', '⟦1⟧ ⟦1⟧']) {
    const log = [];
    const tr = makeMtTranslator({ chat: fake([bad, '계속하려면', '클릭하세요.'], log), family: 'hymt', runtime: 'mlx' });
    const { blocks } = await tr({ batch: [link], lang: 'en' });
    assert.equal(log.length, 3);
    assert.equal(log[1].endsWith('\n\nClick'), true);
    assert.deepEqual(blocks[0].slots, { 0: '계속하려면 ', 1: ' 클릭하세요.' });
    assert.equal(tr.stats.fallbackBlocks, 1);
  }
});

test('text in a slot-less gap or a dropped run triggers fallback', async () => {
  const b = { id: 'g', items: [x('A'), x('B'), t(0, ' and more')] };
  const plan = planMarkerBlock(b);
  assert.equal(plan.text, '⟦1⟧⟦2⟧ and more');
  const tr = makeMtTranslator({ chat: fake(['⟦1⟧ 이상한 ⟦2⟧ 그리고 더', '그리고 더'], []), family: 'hymt', runtime: 'mlx' });
  const { blocks } = await tr({ batch: [b], lang: 'en' });
  assert.equal(tr.stats.fallbackBlocks, 1);
  assert.deepEqual(blocks[0].slots, { 0: ' 그리고 더' });
});

test('x-less block is plain: one request, no markers; non-linguistic block passes through without request', async () => {
  const log = [];
  const tr = makeMtTranslator({ chat: fake(['안녕하세요 세계'], log), family: 'translategemma', runtime: 'ollama' });
  const { blocks } = await tr({ batch: [{ id: 'p', items: [t(0, ' Hello '), t(1, 'world')] }, { id: 'n', items: [t(0, '123 -')] }], lang: 'en' });
  assert.equal(log.length, 1);
  assert.ok(!log[0].includes('⟦'));
  assert.deepEqual(blocks[0].slots, { 0: ' 안녕하세요 세계', 1: '' });
  assert.deepEqual(blocks[1].slots, { 0: '123 -' });
  assert.equal(tr.stats.plainBlocks, 1);
  assert.equal(tr.stats.passthroughBlocks, 1);
});

test('chat failure and empty output become per-block errors', async () => {
  const tr = makeMtTranslator({ chat: fake([() => { throw new Error('HTTP 500'); }, '  ']), family: 'hymt', runtime: 'mlx' });
  const { blocks } = await tr({ batch: [{ id: 'a', items: [t(0, 'Hello')] }, { id: 'b', items: [t(0, 'World')] }], lang: 'en' });
  assert.equal(blocks[0].error, 'HTTP 500');
  assert.equal(blocks[1].slots, null);
});

test('backends: mlx raw prompt -> /v1/completions, chat -> /v1/chat/completions, ollama -> /api/chat', async () => {
  const calls = [];
  const post = async (url, body) => { calls.push([url, body]); return url.endsWith('/v1/completions') ? { choices: [{ text: 'A' }] } : url.endsWith('/api/chat') ? { message: { content: 'C' } } : { choices: [{ message: { content: 'B' } }] }; };
  const mlx = makeMlxMtChat({ model: 'm' }, 'translategemma', post);
  assert.equal(await mlx({ request: { prompt: 'p' } }), 'A');
  assert.equal(await makeMlxMtChat({ model: 'm' }, 'hymt', post)({ request: { messages: [{ role: 'user', content: 'u' }] } }), 'B');
  assert.equal(await makeOllamaMtChat({ model: 'translategemma:4b', keepAlive: 600 }, 'translategemma', post)({ request: { messages: [{ role: 'user', content: 'u' }] } }), 'C');
  assert.equal(calls[0][0], 'http://127.0.0.1:8080/v1/completions');
  assert.equal(calls[1][1].top_k, 20);
  assert.equal(calls[2][0], 'http://127.0.0.1:11434/api/chat');
  assert.equal(calls[2][1].keep_alive, 600);
});
