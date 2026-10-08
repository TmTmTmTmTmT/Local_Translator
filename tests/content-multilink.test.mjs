// F15: distinct anchors in a link-only block become separate blocks.
import test from 'node:test';
import assert from 'node:assert/strict';
import { setup } from './helpers/load-content.mjs';

test('header div > a + a splits into two single-slot blocks', async () => {
  const e = setup('<body><div id=h><a href="#">Login</a><a class=b href="#">Join Members Club</a></div></body>');
  const recs = e.KT.collectBlocks(e.document.body, {});
  assert.equal(recs.length, 2);
  for (const r of recs) assert.equal(r.slots.length, 1);
  assert.equal(recs[0].el.tagName, 'A');
  assert.equal(recs[1].el.className, 'b');
  assert.notEqual(recs[0].id, recs[1].id);
  e.close();
});

test('end to end: both anchors get their own translation', async () => {
  const e = setup('<body><div><a id=a href="#">Login</a><a id=b href="#">Join Members Club</a></div></body>');
  e.start(); await e.idle();
  assert.equal(e.q('#a').firstChild.nodeValue, 'KO:Login');
  assert.equal(e.q('#b').firstChild.nodeValue, 'KO:Join Members Club');
  e.close();
});

test('one anchor with two spans stays one block', () => {
  const e = setup('<body><div><a href="#"><span>Formula One</span><span>Race report</span></a></div></body>');
  const recs = e.KT.collectBlocks(e.document.body, {});
  assert.equal(recs.length, 1);
  assert.equal(recs[0].slots.length, 2);
  e.close();
});

test('linkMode never unchanged for multi-anchor block', () => {
  const e = setup('<body><div><a href="#">Login</a><a href="#">Join Members Club</a></div></body>');
  assert.equal(e.KT.collectBlocks(e.document.body, { linkMode: 'never' }).length, 0);
  e.close();
});
