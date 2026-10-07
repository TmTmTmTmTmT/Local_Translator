import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { LRU, createPersistentCache } = require('../extension/lib/cache.js');

test('LRU evicts oldest, get refreshes', () => {
  const c = new LRU(3);
  c.set('a', 1); c.set('b', 2); c.set('c', 3);
  assert.equal(c.get('a'), 1); // a becomes newest
  c.set('d', 4); // evicts b
  assert.deepEqual(c.keys(), ['c', 'a', 'd']);
  assert.equal(c.get('b'), undefined);
  c.set('c', 30); // overwrite refreshes
  assert.deepEqual(c.keys(), ['a', 'd', 'c']);
});

function fakeTimers() {
  const t = { pending: [], id: 0 };
  t.setTimeout = (f, ms) => { const id = ++t.id; t.pending.push({ id, f, ms }); return id; };
  t.clearTimeout = (id) => { t.pending = t.pending.filter((p) => p.id !== id); };
  t.fire = () => { const p = t.pending; t.pending = []; p.forEach((x) => x.f()); };
  return t;
}

test('persistent cache: debounced batched save, load, persistMax eviction', async () => {
  const t = fakeTimers();
  const saves = [];
  const c = createPersistentCache({
    capacity: 2, persistMax: 3, debounceMs: 500,
    load: async () => ({ old1: 'x', old2: 'y' }),
    save: async (o) => { saves.push(o); },
    setTimeout: t.setTimeout, clearTimeout: t.clearTimeout, now: () => 42,
  });
  await c.ready();
  assert.equal(c.get('old1'), 'x'); // from disk copy
  c.set('a', 1); c.set('b', 2); c.set('c', 3);
  assert.equal(t.pending.length, 1); // single debounced timer
  assert.equal(t.pending[0].ms, 500);
  assert.equal(saves.length, 0);
  t.fire();
  await c.flush();
  assert.equal(saves.length, 1);
  assert.deepEqual(Object.keys(saves[0]), ['a', 'b', 'c']); // oldest beyond persistMax dropped
  assert.equal(c.lastSavedAt, 42);
  assert.equal(c.size, 2);
  assert.equal(c.get('a'), 1); // memory evicted, still on disk copy
  await c.flush();
  assert.equal(saves.length, 1); // not dirty
});

test('persistent cache: clear persists empty', async () => {
  const t = fakeTimers();
  const saves = [];
  const c = createPersistentCache({ capacity: 5, persistMax: 5, save: async (o) => saves.push(o), setTimeout: t.setTimeout, clearTimeout: t.clearTimeout });
  c.set('a', 1);
  c.clear();
  t.fire(); await c.flush();
  assert.deepEqual(saves.at(-1), {});
  assert.equal(c.get('a'), undefined);
});
