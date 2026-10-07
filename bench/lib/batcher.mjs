// Greedy sequential batching: consecutive blocks, limited by chars and block count (SPEC section 2).
import { blockChars } from './corpus.mjs';

export const DEFAULT_LIMIT = { chars: 6000, blocks: 40 };

export function makeBatches(blocks, limit = DEFAULT_LIMIT) {
  const maxChars = limit.chars ?? DEFAULT_LIMIT.chars;
  const maxBlocks = limit.blocks ?? DEFAULT_LIMIT.blocks;
  const batches = [];
  let cur = [], chars = 0;
  for (const b of blocks) {
    const c = blockChars(b);
    if (cur.length && (cur.length >= maxBlocks || chars + c > maxChars)) {
      batches.push(cur);
      cur = []; chars = 0;
    }
    cur.push(b);
    chars += c;
  }
  if (cur.length) batches.push(cur);
  return batches;
}
