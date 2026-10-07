import test from 'node:test';
import assert from 'node:assert'; // loose: vm 컨텍스트 객체는 프로토타입이 달라 strict deepEqual 불가
import { loadEngines, B, t, x } from './engines-load.mjs';

const E = loadEngines();

test('system prompt contains rules 1-5 and per-language notes', () => {
  const s = E.buildSystemPrompt('en');
  for (const n of ['1.', '2.', '3.', '4.', '5.']) assert.ok(s.includes(`\n${n} `));
  assert.ok(!s.includes('[일본어 보충]'));
  assert.ok(E.buildSystemPrompt('ja').includes('[일본어 보충]'));
  assert.ok(E.buildSystemPrompt('zh').includes('[중국어 간체 보충]'));
  assert.ok(E.buildSystemPrompt('zh-Hant').includes('[중국어 번체 보충]'));
});

test('user payload shape', () => {
  const blocks = [B('b1', t(0, 'Click '), x('here'), t(1, ' to go'))];
  const p = E.buildUserPayload('en', { title: 'T', host: 'h.com', extra: 1 }, blocks);
  assert.deepEqual(p, { lang: 'en', context: { title: 'T', host: 'h.com' }, blocks: [{ id: 'b1', items: [{ k: 't', i: 0, text: 'Click ' }, { k: 'x', text: 'here' }, { k: 't', i: 1, text: ' to go' }] }] });
  const m = E.buildMessages({ lang: 'en', context: null, blocks, userSuffix: '/no_think' });
  assert.equal(m[0].role, 'system');
  assert.ok(m[1].content.endsWith('\n/no_think'));
  assert.equal(JSON.parse(m[1].content.split('\n')[0]).context.title, '');
});

const ok = { blocks: [{ id: 'a', t: { 0: '안녕', 1: '세상' } }, { id: 'b', t: { 0: 'x' } }] };
const check = (text) => {
  const m = E.parseLlmOutput(text);
  assert.equal(Object.prototype.toString.call(m), '[object Map]');
  assert.deepEqual(m.get('a'), { 0: '안녕', 1: '세상' });
  assert.deepEqual(m.get('b'), { 0: 'x' });
};

test('parser: plain, fenced, think block, prose around', () => {
  const j = JSON.stringify(ok);
  check(j);
  check('```json\n' + j + '\n```');
  check('<think>hmm {"blocks": []} </think>\n' + j);
  check('Here you go:\n' + j + '\nDone.');
  check('reasoning...</think>' + j); // closing tag only
});

test('parser: trailing commas and raw newline in string', () => {
  check('{"blocks":[{"id":"a","t":{"0":"안녕","1":"세상",},},{"id":"b","t":{"0":"x"}},]}');
  const m = E.parseLlmOutput('{"blocks":[{"id":"a","t":{"0":"a\nb"}}]}');
  assert.equal(m.get('a')[0], 'a\nb');
});

test('parser: partial/truncated output keeps complete blocks', () => {
  const m = E.parseLlmOutput('{"blocks":[{"id":"a","t":{"0":"안녕","1":"세상"}},{"id":"b","t":{"0":"부분');
  assert.deepEqual(m.get('a'), { 0: '안녕', 1: '세상' });
  assert.equal(m.get('b')[0], '부분');
});

test('parser: alternative shapes and failures', () => {
  assert.deepEqual(E.parseLlmOutput('{"a":{"t":{"t0":"가"}}}').get('a'), { 0: '가' });
  assert.deepEqual(E.parseLlmOutput('{"blocks":[{"id":"a","t":["가","나"]}]}').get('a'), { 0: '가', 1: '나' });
  assert.equal(E.parseLlmOutput('no json here'), null);
  assert.equal(E.parseLlmOutput(''), null);
  assert.equal(E.parseLlmOutput('{"foo":1}'), null);
});

test('validateSlots filters unexpected and reports missing', () => {
  const b = B('a', t(0, 'x'), x('l'), t(2, 'y'));
  const m = new Map([['a', { 0: '가', 1: 'stray', 5: 'z' }]]);
  const v = E.validateSlots(b, m);
  assert.deepEqual(v.slots, { 0: '가' });
  assert.deepEqual(v.missing, ['2']);
  assert.equal(v.complete, false);
  assert.equal(v.present, true);
  const v2 = E.validateSlots(b, new Map());
  assert.equal(v2.present, false);
  assert.equal(E.validateSlots(b, new Map([['a', { 0: 'a', 2: '' }]])).complete, true);
});
