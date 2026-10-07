import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripThink, extractJson, repairJson, normalizeSlots, normalizeBlocks, parseBatchOutput } from './parse.mjs';

const batch = [
  { id: 'a', items: [{ k: 't', i: 0, text: 'Click ' }, { k: 'x', text: 'here' }, { k: 't', i: 1, text: ' to go' }] },
  { id: 'b', items: [{ k: 't', i: 0, text: 'Hello' }] },
];
const good = { blocks: [{ id: 'a', t: { 0: '클릭 ', 1: ' 이동' } }, { id: 'b', t: { 0: '안녕' } }] };

test('stripThink removes closed, stray-close and open think tags', () => {
  assert.equal(stripThink('<think>abc</think>{"a":1}'), '{"a":1}');
  assert.equal(stripThink('reasoning...</think>\n{"a":1}'), '\n{"a":1}');
  assert.equal(stripThink('<think>\n{"x":1}\n</think>{"a":2}'), '{"a":2}');
});

test('extractJson: plain, fenced, prose-wrapped, think-wrapped', () => {
  const j = JSON.stringify(good);
  for (const txt of [j, '```json\n' + j + '\n```', 'Here you go:\n```\n' + j + '\n```\nDone', 'sure! ' + j + ' bye', '<think>{"blocks":[]}</think>```json\n' + j + '```']) {
    const r = extractJson(txt);
    assert.ok(r.ok, txt);
    assert.deepEqual(r.value, good);
  }
});

test('extractJson repairs trailing commas, raw newlines, truncation, unclosed fence', () => {
  assert.deepEqual(extractJson('{"blocks":[{"id":"b","t":{"0":"a",},},],}').value.blocks[0].t, { 0: 'a' });
  assert.equal(extractJson('{"blocks":[{"id":"b","t":{"0":"줄1\n줄2"}}]}').value.blocks[0].t[0], '줄1\n줄2');
  const trunc = extractJson('```json\n{"blocks":[{"id":"a","t":{"0":"클릭 ","1":"이동');
  assert.ok(trunc.ok && trunc.repaired);
  assert.equal(trunc.value.blocks[0].t[1], '이동');
  assert.equal(extractJson('{"blocks":[{"id":"a","t":{"0":').ok, true);
});

test('extractJson fails on non-JSON', () => {
  assert.equal(extractJson('죄송합니다, 번역할 수 없습니다.').ok, false);
  assert.equal(extractJson('').ok, false);
});

test('repairJson leaves valid JSON semantically intact', () => {
  const s = JSON.stringify(good);
  assert.deepEqual(JSON.parse(repairJson(s)), good);
  assert.equal(JSON.parse(repairJson('{"a":"x, ]}"}')).a, 'x, ]}');
});

test('normalizeSlots variants', () => {
  assert.deepEqual(normalizeSlots({ 0: 'a', 1: 'b', 9: 'zz' }, [0, 1]), { 0: 'a', 1: 'b' });
  assert.deepEqual(normalizeSlots(['a', 'b'], [0, 1]), { 0: 'a', 1: 'b' });
  assert.deepEqual(normalizeSlots([{ i: 1, text: 'b' }], [0, 1]), { 1: 'b' });
  assert.deepEqual(normalizeSlots({ t0: 'a', t1: 'b' }, [0, 1]), { 0: 'a', 1: 'b' });
  assert.deepEqual(normalizeSlots('only', [0]), { 0: 'only' });
  assert.deepEqual(normalizeSlots('only', [0, 1]), {});
  assert.deepEqual(normalizeSlots({ 0: 5, 1: null, 2: {} }, [0, 1, 2]), { 0: '5' });
  assert.deepEqual(normalizeSlots({ 0: '' }, [0]), { 0: '' });
});

test('normalizeBlocks: id match, partial slots, missing block, positional fallback, keyed object', () => {
  const r = normalizeBlocks({ blocks: [{ id: 'a', t: { 0: '클릭 ' } }] }, batch);
  assert.deepEqual(r[0].slots, { 0: '클릭 ' });
  assert.equal(r[0].error, null);
  assert.equal(r[1].slots, null);
  assert.match(r[1].error, /missing/);
  const pos = normalizeBlocks({ blocks: [{ id: 'x1', t: { 0: 'p', 1: 'q' } }, { id: 'x2', t: { 0: 'r' } }] }, batch);
  assert.deepEqual(pos[1].slots, { 0: 'r' });
  const keyed = normalizeBlocks({ blocks: { a: { 0: 'p', 1: 'q' }, b: { 0: 'r' } } }, batch);
  assert.deepEqual(keyed[0].slots, { 0: 'p', 1: 'q' });
  const top = normalizeBlocks([{ id: 'a', t: ['p', 'q'] }, { id: 'b', t: ['r'] }], batch);
  assert.deepEqual(top[0].slots, { 0: 'p', 1: 'q' });
  assert.equal(normalizeBlocks('nope', batch), null);
});

test('empty-string slot counts as returned', () => {
  const r = normalizeBlocks({ blocks: [{ id: 'a', t: { 0: '', 1: '이동' } }, { id: 'b', t: { 0: 'x' } }] }, batch);
  assert.deepEqual(r[0].slots, { 0: '', 1: '이동' });
});

test('parseBatchOutput valid / invalid', () => {
  const ok = parseBatchOutput('```json\n' + JSON.stringify(good) + '\n```', batch);
  assert.ok(ok.valid);
  assert.equal(ok.blocks.length, 2);
  assert.equal(parseBatchOutput('no json', batch).valid, false);
  assert.equal(parseBatchOutput('{"foo": 1}', batch).valid, false);
});
