// F5: 링크로만 된 블록 승격(linkMode) 검증.
import test from 'node:test';
import assert from 'node:assert/strict';
import { setup } from './helpers/load-content.mjs';

const kinds = (r) => r.block.items.map((i) => i.k + ':' + i.text);

test('card a>h3+p and menu ul>li>a are translated; links promoted in order', async () => {
  const e = setup('<body><a id=c href="/x"><h3>What really happened</h3><p>Formula One news</p></a><ul><li><a href="/m">Read more stories</a></li></ul></body>');
  e.start(); await e.idle();
  assert.equal(e.q('h3').firstChild.nodeValue, 'KO:What really happened');
  assert.equal(e.q('p').firstChild.nodeValue, 'KO:Formula One news');
  assert.equal(e.q('li a').firstChild.nodeValue, 'KO:Read more stories');
  assert.equal(e.q('#c').children.length, 2); // 구조 불변
  e.close();
});

test('inline link in a sentence stays original; Related: <a> keeps link', async () => {
  const e = setup('<body><p id=a>Click <a href="#">here now</a> to continue</p><p id=b>Related: <a href="#">Some title here</a></p></body>');
  e.start(); await e.idle();
  assert.equal(e.q('#a a').firstChild.nodeValue, 'here now');
  assert.equal(e.q('#b a').firstChild.nodeValue, 'Some title here');
  e.close();
});

test('code-only block and link inside code are not translated', async () => {
  const e = setup('<body><p id=a><code>npm install thing</code></p><pre id=b><a href="#">some linked code</a></pre></body>');
  const recs = e.KT.collectBlocks(e.document.body, {});
  assert.equal(recs.length, 0);
  e.close();
});

test('linkMode never reproduces old behavior; unknown value means standalone', () => {
  const e = setup('<body><ul><li id=l><a href="#">Read more stories</a></li></ul></body>');
  assert.equal(e.KT.collectBlocks(e.document.body, { linkMode: 'never' }).length, 0);
  assert.equal(e.KT.collectBlocks(e.document.body, { linkMode: 'bogus' }).length, 1);
  const r = e.KT.collectBlocks(e.document.body, {})[0];
  assert.equal(kinds(r).join('|'), 't:Read more stories');
  e.close();
});

test('main start({linkMode:never}) leaves link-only blocks alone', async () => {
  const e = setup('<body><ul><li><a href="#">Read more stories</a></li></ul></body>');
  e.start({ linkMode: 'never' }); await e.idle();
  assert.equal(e.q('a').firstChild.nodeValue, 'Read more stories');
  e.close();
});

test('toggle original round trip restores promoted link text', async () => {
  const e = setup('<body><p><a href="#">Read more stories</a></p></body>');
  e.start(); await e.idle();
  const n = e.q('a').firstChild;
  assert.equal(n.nodeValue, 'KO:Read more stories');
  e.KT.main.handleMessage({ type: 'toggleOriginal' });
  assert.equal(n.nodeValue, 'Read more stories');
  e.KT.main.handleMessage({ type: 'toggleOriginal' });
  assert.equal(n.nodeValue, 'KO:Read more stories');
  e.close();
});
