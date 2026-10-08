import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { loadEngines } from './engines-load.mjs';
import { loadBackground, makeFakeBrowser } from './helpers/fake-browser.mjs';

const require = createRequire(import.meta.url);
const G = require('../extension/lib/glossary.js');
const P = loadEngines();
const M = P.mtmode;
const eq = (a, b) => assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), b);
const t = (i, text) => ({ k: 't', i, text });
const run = (text, list, lang = 'en') => {
  const r = G.applyToItems([t(0, text)], lang, G.normalize(list));
  return { text: r.items[0].text, applied: r.applied };
};

test('boundary: kerb vs kerbs', () => {
  eq(run('kerbs and kerb', [{ src: 'kerb', dst: 'K' }]).text, 'kerbs and K');
  eq(run('a_kerb kerb2 (kerb).', [{ src: 'kerb', dst: 'K' }]).text, 'a_kerb kerb2 (K).');
});

test('case-insensitive by default, case:true is exact', () => {
  eq(run('Safety Car', [{ src: 'safety car', dst: 'SC' }]).text, 'SC');
  eq(run('Safety Car safety car', [{ src: 'safety car', dst: 'SC', case: true }]).text, 'Safety Car SC');
});

test('longer term first, no overlap, no rescan', () => {
  eq(run('safety car car', [{ src: 'car', dst: '차' }, { src: 'safety car', dst: '세이프티카' }]).text, '세이프티카 차');
  eq(run('a b', [{ src: 'a', dst: 'b' }, { src: 'b', dst: 'c' }]).text, 'b c');
  eq(run('aa', [{ src: 'aa', dst: 'a a' }, { src: 'a', dst: 'z' }]).text, 'a a');
});

test('CJK is substring; lang filter', () => {
  eq(run('これは用語集です', [{ src: '用語', dst: '용어' }], 'ja').text, 'これは용어集です');
  eq(run('kerb', [{ src: 'kerb', dst: 'K', lang: 'ja' }], 'en').text, 'kerb');
  eq(run('kerb', [{ src: 'kerb', dst: 'K', lang: 'en' }], 'en').text, 'K');
  eq(run('kerb', [{ src: 'kerb', dst: 'K', lang: 'zh' }], 'zh-Hans').text, 'K');
});

test('x untouched, input not mutated, applied sorted unique', () => {
  const items = [t(0, 'kerb kerb safety car'), { k: 'x', text: 'kerb' }];
  const copy = JSON.parse(JSON.stringify(items));
  const r = G.applyToItems(items, 'en', G.normalize([{ src: 'safety car', dst: 'S' }, { src: 'kerb', dst: 'K' }]));
  eq(items, copy);
  assert.equal(r.items[1], items[1]);
  assert.notEqual(r.items, items);
  eq(r.items[0].text, 'K K S');
  eq(r.applied, [['kerb', 'K'], ['safety car', 'S']]);
});

test('empty glossary / no match returns same reference', () => {
  const items = [t(0, 'hello')];
  assert.equal(G.applyToItems(items, 'en', []).items, items);
  const r = G.applyToItems(items, 'en', G.normalize([{ src: 'zzz', dst: 'Z' }]));
  assert.equal(r.items, items);
  eq(r.applied, []);
});

test('normalize: invalid dropped, dedupe, cap', () => {
  const n = G.normalize([null, 1, { src: '', dst: 'a' }, { src: 'a', dst: '' }, { src: 'x'.repeat(81), dst: 'a' },
    { src: 'Foo', dst: '1' }, { src: 'foo', dst: '2' }, { src: 'foo', dst: '3', lang: 'en' }, { src: 5, dst: 'a' }]);
  eq(n.map((x) => [x.src, x.dst, x.lang]), [['Foo', '1', null], ['foo', '3', 'en']]);
  const many = Array.from({ length: 600 }, (_, i) => ({ src: 'w' + i, dst: 'd' }));
  assert.equal(G.normalize(many).length, 500);
  eq(G.normalize('x'), []);
});

test('hintFor / appliedKey', () => {
  assert.equal(G.hintFor([]), '');
  assert.equal(G.hintFor([['a', 'b'], ['c', 'd']]), '용어집(반드시 지킬 것): a → b; c → d');
  assert.equal(G.appliedKey([]), '');
  assert.equal(G.appliedKey([['a', 'b']]), G.appliedKey([['a', 'b']]));
  assert.notEqual(G.appliedKey([['a', 'b']]), G.appliedKey([['a', 'c']]));
  assert.match(G.appliedKey([['a', 'b']]), /^[0-9a-f]{16}$/);
});

test('prompt: glossary hint only for chat prompts when present', () => {
  const blocks = [{ id: 'a', items: [t(0, 'x')] }];
  const base = P.buildMessages({ lang: 'en', context: { title: 'T' }, blocks });
  assert.equal(base[0].content, P.buildSystemPrompt('en'));
  const same = P.buildMessages({ lang: 'en', context: { title: 'T', glossary: [] }, blocks });
  assert.deepStrictEqual(same, base);
  const withG = P.buildMessages({ lang: 'en', context: { glossary: [['kerb', '연석']] }, blocks });
  assert.ok(withG[0].content.startsWith(P.buildSystemPrompt('en')));
  assert.ok(withG[0].content.endsWith('용어집(반드시 지킬 것): kerb → 연석'));
  assert.equal(withG[1].content, base[1].content.replace('"title":"T"', '"title":""'));
});

test('mtmode: hint in chat family only', () => {
  const gl = [['kerb', '연석']];
  const args = (family, glossary) => ({ family, runtime: 'ollama', srcLang: 'en', text: 'hi', glossary });
  const chat = M.buildMtRequest(args('chat', gl));
  assert.ok(chat.messages[0].content.endsWith('용어집(반드시 지킬 것): kerb → 연석'));
  eq(M.buildMtRequest(args('chat', null)).messages[0].content, M.chatSystemText('en'));
  for (const f of ['hymt2', 'translategemma']) eq(M.buildMtRequest(args(f, gl)), JSON.parse(JSON.stringify(M.buildMtRequest(args(f, null)))));
});

test('mtmode translator forwards context.glossary', async () => {
  const seen = [];
  const tr = M.makeMtTranslator({ family: 'chat', runtime: 'ollama', chat: async ({ request }) => { seen.push(request.messages[0].content); return '번역'; } });
  const blocks = [{ id: 'a', lang: 'en', items: [t(0, 'hi')] }];
  await tr({ blocks, lang: 'en', context: { glossary: [['a', 'b']] } });
  await tr({ blocks, lang: 'en', context: {} });
  assert.ok(seen[0].includes('a → b'));
  assert.ok(!seen[1].includes('용어집'));
});

// ---- background integration ----
const KT = loadBackground();
const sender = { tab: { id: 7, url: 'https://example.com/a' } };
function setup(glossary) {
  const calls = [];
  const engine = {
    id: 'local:x', kind: 'localhost', batchLimit: { chars: 1000, blocks: 10 }, concurrency: 1,
    async translate(blocks, ctx) {
      calls.push({ blocks: JSON.parse(JSON.stringify(blocks)), ctx: JSON.parse(JSON.stringify(ctx)), hasKey: 'glossary' in ctx });
      return new Map(blocks.map((b) => [b.id, { 0: 'KO:' + b.items[0].text }]));
    },
  };
  const sync = glossary === undefined ? undefined : { settings: { glossary } };
  const browser = makeFakeBrowser({ sync });
  const keys = [];
  const store = new Map();
  const cache = { ready: async () => {}, get: (k) => store.get(k), set: (k, v) => { keys.push(k); store.set(k, v); } };
  const bg = KT.background.createBackground({ browser, KT, engines: { pickEngine: () => engine }, cache });
  return { bg, calls, keys, browser };
}
const blk = (id, text) => ({ id, lang: 'en', items: [t(0, text), { k: 'x', text: 'kerb' }] });

test('background: substituted text reaches engine, results keyed by id, context only when applied', async () => {
  const { bg, calls } = setup([{ src: 'kerb', dst: '연석' }]);
  const r = await bg.handleMessage({ type: 'translate', lang: 'en', context: { title: 'T' }, blocks: [blk('a', 'a kerb here'), blk('b', 'nothing')] }, sender);
  eq(r.results.map((x) => [x.id, x.slots]).sort(), [['a', { 0: 'KO:a 연석 here' }], ['b', { 0: 'KO:nothing' }]]);
  eq(calls[0].blocks.find((b) => b.id === 'a').items, [t(0, 'a 연석 here'), { k: 'x', text: 'kerb' }]);
  eq(calls[0].ctx, { title: 'T', glossary: [['kerb', '연석']] });
  const r2 = await setup([{ src: 'kerb', dst: '연석' }]).bg.handleMessage({ type: 'translate', lang: 'en', blocks: [blk('b', 'nothing')] }, sender);
  assert.equal(r2.ok, true);
});

test('background: no glossary -> no context key, old cache key; glossary change -> new key', async () => {
  const old = setup();
  await old.bg.handleMessage({ type: 'translate', lang: 'en', context: { title: 'T' }, blocks: [blk('a', 'a kerb here')] }, sender);
  assert.equal(old.calls[0].hasKey, false);
  eq(old.calls[0].blocks[0].items[0].text, 'a kerb here');
  const h = KT.lib.hash;
  assert.equal(old.keys[0], h.cacheKey('local:x', '', blk('a', 'a kerb here').items));

  const g1 = setup([{ src: 'kerb', dst: '연석' }]);
  const g2 = setup([{ src: 'kerb', dst: '턱' }]);
  for (const g of [g1, g2]) await g.bg.handleMessage({ type: 'translate', lang: 'en', blocks: [blk('a', 'a kerb here')] }, sender);
  assert.notEqual(g1.keys[0], old.keys[0]);
  assert.notEqual(g1.keys[0], g2.keys[0]);

  // glossary that does not match the block keeps the old key and sends no context.glossary
  const nm = setup([{ src: 'zzz', dst: 'Z' }]);
  await nm.bg.handleMessage({ type: 'translate', lang: 'en', blocks: [blk('a', 'a kerb here')] }, sender);
  assert.equal(nm.keys[0], old.keys[0]);
  assert.equal(nm.calls[0].hasKey, false);
});
