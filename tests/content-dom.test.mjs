import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { setup, structure, textNodes, fakeTranslateResponse } from './helpers/load-content.mjs';

const JOSA = readFileSync(fileURLToPath(new URL('../extension/lib/josa.js', import.meta.url)), 'utf8');
function env(html, opts, withJosa = true) {
  const e = setup(html, opts);
  if (withJosa) e.win.eval(JOSA);
  return e;
}
// 번역: t 슬롯 텍스트를 맵으로 치환.
const mapper = (m) => (msg) => fakeTranslateResponse(msg, (t) => (t in m ? m[t] : 'KO:' + t));

test('particles: x item last Hangul char decides single form; Latin end keeps pair', async () => {
  const e = env('<body><p id=a>Click <a href="#">책</a> to go</p><p id=b>Click <a href="#">API</a> to go</p></body>', {
    respond: mapper({ Click: '클릭: ', 'to go': '을(를) 보세요' }),
  });
  e.start(); await e.idle();
  assert.equal(e.q('#a').lastChild.nodeValue, '을 보세요'); // 조사는 x에 붙여 씀(원문 앞 공백 제거)
  assert.equal(e.q('#b').lastChild.nodeValue, ' 을(를) 보세요');
  e.close();
});

test('particles: option fixParticles=false and missing josa lib leave pair as is', async () => {
  const html = '<body><p>Click <a href="#">문서</a> to go</p></body>';
  const r = mapper({ Click: '클릭: ', 'to go': '을(를) 보세요' });
  let e = env(html, { respond: r }); e.start({ fixParticles: false }); await e.idle();
  assert.equal(e.q('p').lastChild.nodeValue, ' 을(를) 보세요'); e.close();
  e = env(html, { respond: r }, false); e.start(); await e.idle();
  assert.equal(e.q('p').lastChild.nodeValue, ' 을(를) 보세요'); e.close();
});

test('particles: inside a slot, pair after Hangul resolved; toggle round trip restores original', async () => {
  const e = env('<body><p id=p>The file is here</p></body>', { respond: mapper({ 'The file is here': '파일이(가) 여기 있고 API이(가) 있다' }) });
  const n = e.q('#p').firstChild;
  e.start(); await e.idle();
  assert.equal(n.nodeValue, '파일이 여기 있고 API이(가) 있다');
  e.KT.main.handleMessage({ type: 'toggleOriginal' });
  assert.equal(n.nodeValue, 'The file is here');
  e.KT.main.handleMessage({ type: 'toggleOriginal' });
  assert.equal(n.nodeValue, '파일이 여기 있고 API이(가) 있다');
  e.close();
});

test('filter: role=code is kept (context only), not translated', async () => {
  const e = env('<body><p>Run <span role="code">npm i</span> now</p></body>');
  e.start(); await e.idle();
  assert.equal(e.q('span').textContent, 'npm i');
  assert.deepEqual(e.messenger.translates[0].blocks[0].items.map((i) => i.k), ['t', 'x', 't']);
  e.close();
});

test('br: text around <br> becomes separate slots of one block; br kept', async () => {
  const e = env('<body><p id=p>Line one<br>Line two<br>Line three</p></body>');
  const before = structure(e.document.body);
  e.start(); await e.idle();
  const blocks = e.messenger.translates[0].blocks;
  assert.equal(blocks.length, 1);
  assert.deepEqual(blocks[0].items.map((i) => i.k + i.i), ['t0', 't1', 't2']);
  assert.equal(e.q('#p').textContent, 'KO:Line oneKO:Line twoKO:Line three');
  assert.equal(structure(e.document.body), before);
  e.close();
});

test('mutations: own writes ignored (counter), repeated mutations coalesced, no re-request', async () => {
  const e = env('<body><p id=p>Hello world</p><div id=d></div></body>');
  const st = e.start(); await e.idle();
  assert.equal(e.messenger.translates.length, 1);
  const n = e.q('#p').firstChild;
  e.KT.main.handleMessage({ type: 'toggleOriginal' }); // 우리 쓰기(원문 복원)
  e.KT.main.handleMessage({ type: 'toggleOriginal' }); // 우리 쓰기(번역 재적용)
  await e.idle();
  assert.ok(st.metrics.ownWrites >= 1);
  // 페이지가 같은 노드를 연속 변경 -> 한 번만 재번역
  n.nodeValue = 'First change'; n.nodeValue = 'Second change here';
  await e.idle();
  assert.equal(e.messenger.translates.length, 2);
  assert.equal(e.messenger.translates[1].blocks[0].items[0].text, 'Second change here');
  assert.ok(st.metrics.coalesced >= 1);
  e.close();
});

test('mutations: descendant of a queued added root is not processed separately; same root once', async () => {
  const e = env('<body><div id=d></div></body>');
  const st = e.start(); await e.idle();
  const root = e.document.createElement('section');
  const p = e.document.createElement('p'); p.textContent = 'Fresh paragraph';
  root.appendChild(p);
  e.q('#d').appendChild(root);
  e.q('#d').appendChild(e.document.createElement('i')); // 무관한 추가
  p.appendChild(e.document.createTextNode(' extra words'));
  await e.idle();
  const reqs = e.messenger.translates.flatMap((m) => m.blocks);
  assert.equal(reqs.filter((b) => b.items.some((i) => i.text && i.text.includes('Fresh'))).length, 1);
  assert.ok(st.metrics.deduped >= 1);
  e.close();
});

test('attrs: off by default; on translates title/alt/placeholder via setAttribute and toggles back', async () => {
  const html = '<body><p>Plain text</p><img id=i alt="A red apple" src="x.png"><input id=in placeholder="Search here" title="한국어 제목"></body>';
  let e = env(html); e.start(); await e.idle();
  assert.equal(e.q('#i').getAttribute('alt'), 'A red apple'); e.close();

  e = env(html);
  const before = structure(e.document.body);
  e.start({ translateAttrs: true }); await e.idle();
  assert.equal(e.q('#i').getAttribute('alt'), 'KO:A red apple');
  assert.equal(e.q('#in').getAttribute('placeholder'), 'KO:Search here');
  assert.equal(e.q('#in').getAttribute('title'), '한국어 제목');
  assert.equal(e.q('#i').hasAttribute('data-kt'), false);
  assert.equal(e.q('#i').hasAttribute('lang'), false);
  assert.equal(structure(e.document.body), before);
  e.KT.main.handleMessage({ type: 'toggleOriginal' });
  assert.equal(e.q('#i').getAttribute('alt'), 'A red apple');
  assert.equal(e.q('#in').getAttribute('placeholder'), 'Search here');
  e.KT.main.handleMessage({ type: 'toggleOriginal' });
  assert.equal(e.q('#i').getAttribute('alt'), 'KO:A red apple');
  e.close();
});

test('attrs: translate=no / excluded ancestors skipped; dynamic nodes picked up', async () => {
  const e = env('<body><div translate="no"><img alt="Skip this one"></div><div id=d></div></body>');
  e.start({ translateAttrs: true }); await e.idle();
  assert.equal(e.q('img').getAttribute('alt'), 'Skip this one');
  const b = e.document.createElement('button'); b.setAttribute('title', 'Open menu');
  e.q('#d').appendChild(b);
  await e.idle();
  assert.equal(b.getAttribute('title'), 'KO:Open menu');
  e.close();
});
