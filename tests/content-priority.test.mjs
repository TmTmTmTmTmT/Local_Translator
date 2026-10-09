import test from 'node:test';
import assert from 'node:assert/strict';
import { setup } from './helpers/load-content.mjs';

// All blocks are held back by the IO stub, then delivered in one scrambled callback with positions.
function deliver(e, order, vh = 768) {
  const inst = e.io.instances[0];
  const entries = order.map(([sel, top]) => ({ target: e.q(sel), isIntersecting: true, boundingClientRect: { top, bottom: top + 20 } }));
  inst.cb(entries, inst);
}
const holdAll = (e) => { for (const p of e.qa('p')) e.io.hidden.add(p); };
const ids = (m) => m.blocks.map((b) => b.items[0].text);

test('F16: viewport blocks first in document order, off-screen blocks after; first request is small', async () => {
  const html = '<body>' + Array.from({ length: 10 }, (_, i) => `<p id=p${i}>Sentence number ${i}</p>`).join('') + '</body>';
  const e = setup(html);
  holdAll(e);
  e.start();
  deliver(e, [['#p9', 3000], ['#p7', 2000], ['#p5', 600], ['#p2', 100], ['#p0', 10], ['#p4', 500], ['#p1', 50], ['#p3', 300], ['#p6', 700], ['#p8', 2500]]);
  await e.idle();
  const t = e.messenger.translates;
  assert.deepEqual(ids(t[0]), ['Sentence number 0', 'Sentence number 1', 'Sentence number 2', 'Sentence number 3']);
  assert.equal(t[0].priority, 1);
  assert.deepEqual(ids(t[1]), ['Sentence number 4', 'Sentence number 5', 'Sentence number 6']);
  assert.equal(t[1].priority, 1);
  assert.deepEqual(ids(t[2]), ['Sentence number 7', 'Sentence number 8', 'Sentence number 9']);
  assert.equal(t[2].priority, 0);
  e.close();
});

test('F16: only the first request is capped; later flushes use normal batches', async () => {
  const html = '<body>' + Array.from({ length: 6 }, (_, i) => `<p id=p${i}>Sentence number ${i}</p>`).join('') + '</body>';
  const e = setup(html);
  holdAll(e);
  e.start();
  deliver(e, [['#p0', 10], ['#p1', 20], ['#p2', 30], ['#p3', 40], ['#p4', 50], ['#p5', 60]]);
  await e.idle();
  assert.deepEqual(e.messenger.translates.map((m) => m.blocks.length), [4, 2]);
  const late = e.document.createElement('div');
  for (let i = 0; i < 6; i++) { const p = e.document.createElement('p'); p.textContent = 'Late block ' + i; late.appendChild(p); }
  e.document.body.appendChild(late);
  await e.idle();
  assert.deepEqual(e.messenger.translates.map((m) => m.blocks.length), [4, 2, 6]);
  e.close();
});

test('F16: entries without position info count as viewport (priority 1)', async () => {
  const e = setup('<body><p>Hello there friend</p></body>');
  e.start();
  await e.idle();
  assert.equal(e.messenger.translates[0].priority, 1);
  e.close();
});
