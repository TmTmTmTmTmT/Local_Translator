import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planSegments, assemblePlain, planBatch, assembleBatch, withOuterWhitespace } from './plain.mjs';

const t = (i, text) => ({ k: 't', i, text });
const x = (text) => ({ k: 'x', text });

test('segments split at x; multi-slot run => first slot gets whole text, rest empty', () => {
  const block = { id: 'b', items: [t(0, 'Click '), t(1, 'now '), x('here'), t(2, ' to continue.')] };
  const segs = planSegments(block);
  assert.equal(segs.length, 2);
  assert.deepEqual(segs[0].slotIdx, [0, 1]);
  const slots = assemblePlain(segs, ['지금 클릭', '계속하세요.']);
  assert.deepEqual(slots, { 0: '지금 클릭 ', 1: '', 2: ' 계속하세요.' });
});

test('outer whitespace preserved', () => {
  assert.equal(withOuterWhitespace('  hi  ', ' 안녕 '), '  안녕  ');
  const segs = planSegments({ id: 'b', items: [t(0, ' Hello world ')] });
  assert.deepEqual(assemblePlain(segs, ['안녕 세상']), { 0: ' 안녕 세상 ' });
});

test('non-linguistic segments are kept as-is; missing translation omits slots', () => {
  const block = { id: 'b', items: [t(0, 'Version '), x('2.4'), t(1, ' - '), x('beta'), t(2, ' ok')] };
  const segs = planSegments(block);
  assert.equal(segs[1].translatable, false);
  const slots = assemblePlain(segs, ['버전', null, '좋아']);
  assert.deepEqual(slots, { 0: '버전 ', 1: ' - ', 2: ' 좋아' });
  assert.deepEqual(assemblePlain(segs, ['버전', null, '']), { 0: '버전 ', 1: ' - ' });
});

test('planBatch/assembleBatch round trip; block with nothing returned -> error', () => {
  const batch = [
    { id: 'a', items: [t(0, 'Hello'), x('X'), t(1, 'World')] },
    { id: 'b', items: [t(0, 'Bye')] },
  ];
  const plan = planBatch(batch);
  assert.deepEqual(plan.texts, ['Hello', 'World', 'Bye']);
  const out = assembleBatch(batch, plan, ['안녕', '세계', null]);
  assert.deepEqual(out[0].slots, { 0: '안녕', 1: '세계' });
  assert.equal(out[1].slots, null);
  assert.ok(out[1].error);
});
