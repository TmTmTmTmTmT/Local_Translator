import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractTokens, hangulRatio, repetitionFlag, blockMetrics, aggregateResults, warmSamples, speedMetrics } from './metrics.mjs';
import { percentile } from './timing.mjs';

const t = (i, text) => ({ k: 't', i, text });
const x = (text) => ({ k: 'x', text });

test('extractTokens: numbers, urls, names (en)', () => {
  const k = extractTokens('Visit https://example.com/a1 on March 3, 2024. Then ask Alice about iPhone 15 and NASA at 1,200 km.', 'en');
  assert.deepEqual(k.urls, ['https://example.com/a1']);
  assert.deepEqual(k.numbers, ['3', '2024', '15', '1,200']);
  assert.ok(k.names.includes('Alice') && k.names.includes('iPhone') && k.names.includes('NASA'));
  assert.ok(!k.names.includes('Visit') && !k.names.includes('March') && !k.names.includes('Then'));
});

test('extractTokens: ja/zh latin runs and fullwidth digits', () => {
  const k = extractTokens('GitHubで３件のIssueを開きました。', 'ja');
  assert.deepEqual(k.names, ['GitHub', 'Issue']);
  assert.deepEqual(k.numbers, ['3']);
});

test('hangulRatio and untranslated detection', () => {
  assert.equal(hangulRatio('안녕'), 1);
  assert.equal(hangulRatio('12 !'), null);
  assert.ok(hangulRatio('abc 가나') < 0.5);
  const b = { id: 'b', items: [t(0, 'This is a long English sentence.')] };
  assert.equal(blockMetrics(b, { slots: { 0: 'This is a long English sentence.' } }, 'en').untranslated, true);
  assert.equal(blockMetrics(b, { slots: { 0: '이것은 긴 영어 문장입니다.' } }, 'en').untranslated, false);
});

test('blockMetrics: slot return, token preservation, failures', () => {
  const b = { id: 'b', items: [t(0, 'Version 2.4.1 of Safari at '), x('link'), t(1, ' costs $5.')] };
  const m = blockMetrics(b, { slots: { 0: '사파리 버전 2.4.1 ', 1: ' 가격은 5달러' } }, 'en');
  assert.equal(m.returned, 2);
  assert.deepEqual(m.tokens.numbers, [2, 2]); // '2.4.1' and '5'
});

test('blockMetrics numbers: dotted version counts as one token', () => {
  const b = { id: 'b', items: [t(0, 'Version 2.4.1 and 100')] };
  const m = blockMetrics(b, { slots: { 0: '버전 2.4.1 그리고 100' } }, 'en');
  assert.deepEqual(m.tokens.numbers, [2, 2]);
  const lost = blockMetrics(b, { slots: { 0: '버전 그리고 백' } }, 'en');
  assert.deepEqual(lost.tokens.numbers, [0, 2]);
  const fail = blockMetrics(b, { slots: null, error: 'x' }, 'en');
  assert.equal(fail.failed, true);
  assert.equal(fail.returned, 0);
});

test('length outliers and repetition/hallucination', () => {
  const b = { id: 'b', items: [t(0, 'A reasonably long source sentence here.')] };
  assert.equal(blockMetrics(b, { slots: { 0: '짧' } }, 'en').lenOutlier, true);
  const rep = '이 문장은 반복됩니다. '.repeat(5);
  assert.equal(repetitionFlag(rep, 'source'), true);
  assert.equal(repetitionFlag('정상적인 번역 결과입니다.', 'source'), false);
  assert.equal(blockMetrics(b, { slots: { 0: '환각 '.repeat(100) } }, 'en').longOut, true);
});

test('aggregateResults pools runs; x and json rates', () => {
  const corpus = { lang: 'en', blocks: [{ id: 'a', items: [t(0, 'Hello 5 times'), x('X'), t(1, ' done')] }, { id: 'b', items: [t(0, 'Second block here')] }] };
  const r = {
    lang: 'en', run: 1,
    blocks: [{ id: 'a', ms: 10, slots: { 0: '안녕 5번', 1: '' }, error: null, xPreserved: true }, { id: 'b', ms: 10, slots: null, error: 'boom', xPreserved: false }],
    batches: [{ blockIds: ['a', 'b'], ms: 20, jsonValid: true, retried: true }, { blockIds: [], ms: 1, jsonValid: true, retried: false }],
  };
  const a = aggregateResults(corpus, [r]);
  assert.equal(a.slotReturnRate, 2 / 3);
  assert.equal(a.xPreservationRate, 0.5);
  assert.equal(a.jsonValidRate, 0.5);
  assert.equal(a.errorBlocks, 1);
  assert.equal(a.numberRate, 1);
  const none = aggregateResults(corpus, [{ lang: 'en', run: 1, blocks: [], batches: [{ blockIds: [], ms: 1 }] }]);
  assert.equal(none.jsonValidRate, null);
  assert.equal(none.xPreservationRate, null);
});

test('warm samples exclude first batch on run 1, include run 2+; speedMetrics', () => {
  const mk = (run, firstMs, restMs, total) => ({ run, coldMs: firstMs * 2, totalMs: total, batches: [{ blockIds: ['a'], ms: firstMs }, { blockIds: ['b', 'c'], ms: restMs * 2 }], blocks: [{ id: 'a', ms: firstMs }, { id: 'b', ms: restMs }, { id: 'c', ms: restMs }] });
  const s = warmSamples([mk(1, 1000, 100, 5000), mk(2, 200, 100, 3000)]);
  assert.deepEqual(s.samples.sort((a, b) => a - b), [100, 100, 100, 100, 200]);
  assert.equal(s.fallback, false);
  const single = warmSamples([{ run: 1, batches: [{ blockIds: ['a'], ms: 5 }], blocks: [{ id: 'a', ms: 5 }] }]);
  assert.equal(single.fallback, true);
  const corpus = { blocks: [{ id: 'a', items: [t(0, 'x'.repeat(100))] }] };
  const sp = speedMetrics(corpus, [mk(1, 1000, 100, 2000), mk(2, 200, 100, 1000)]);
  assert.equal(sp.coldMs, 2000);
  assert.equal(sp.warmP50, 100);
  assert.equal(sp.docMs, 1500);
});

test('percentile', () => {
  assert.equal(percentile([1, 2, 3, 4, 5], 50), 3);
  assert.equal(percentile([10], 95), 10);
  assert.equal(percentile([], 50), null);
  assert.equal(percentile([0, 100], 95), 95);
});
