import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeBatches } from './batcher.mjs';
import { validateCorpus, loadCorpus, sliceCorpus, blockChars } from './corpus.mjs';

const blk = (id, n) => ({ id, items: [{ k: 't', i: 0, text: 'x'.repeat(n) }] });

test('batches respect char and block limits and keep order', () => {
  const blocks = [blk('1', 3000), blk('2', 2000), blk('3', 2000), blk('4', 100)];
  const b = makeBatches(blocks, { chars: 6000, blocks: 40 });
  assert.deepEqual(b.map((x) => x.map((y) => y.id)), [['1', '2'], ['3', '4']]);
  const c = makeBatches(blocks, { chars: 100000, blocks: 3 });
  assert.deepEqual(c.map((x) => x.length), [3, 1]);
});

test('oversized single block gets its own batch; empty input -> none', () => {
  assert.deepEqual(makeBatches([blk('1', 100), blk('2', 7000), blk('3', 10)], { chars: 6000, blocks: 40 }).map((x) => x.length), [1, 1, 1]);
  assert.deepEqual(makeBatches([]), []);
});

test('24 small blocks fit one batch by default', () => {
  assert.equal(makeBatches(Array.from({ length: 24 }, (_, i) => blk(String(i), 100))).length, 1);
});

test('validateCorpus checks slot index continuity; sliceCorpus wraps', () => {
  assert.throws(() => validateCorpus({ blocks: [{ id: 'a', items: [{ k: 't', i: 1, text: 'a' }] }] }));
  const c = validateCorpus({ blocks: ['a', 'b', 'c'].map((id) => blk(id, 1)) });
  assert.deepEqual(sliceCorpus(c, 2, 2).blocks.map((b) => b.id), ['c', 'a']);
  assert.equal(blockChars(blk('z', 5)), 5);
});

test('validateCorpus: link genre needs an x item; shipped corpora pass', async () => {
  const t = [{ k: 't', i: 0, text: 'a' }];
  assert.throws(() => validateCorpus({ blocks: [{ id: 'l', genre: 'link', items: t }] }), /no x item/);
  validateCorpus({ blocks: [{ id: 'l', genre: 'link', items: [...t, { k: 'x', text: 'u' }] }] });
  const { readdirSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const { join } = await import('node:path');
  const bench = join(fileURLToPath(import.meta.url), '../..');
  for (const dir of ['corpus', 'corpus-articles']) {
    for (const f of readdirSync(join(bench, dir)).filter((n) => n.endsWith('.json'))) {
      assert.doesNotThrow(() => loadCorpus(join(bench, dir, f)), `${dir}/${f}`);
    }
  }
});
