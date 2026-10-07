import test from 'node:test';
import assert from 'node:assert/strict';
import loose from 'node:assert';
import { setup, structure, textNodes, fakeTranslateResponse } from './helpers/load-content.mjs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function deferred() { let resolve; const promise = new Promise((r) => { resolve = r; }); return { promise, resolve }; }

test('main: translates visible blocks; link/code/input/translate=no/Korean untouched; structure kept', async () => {
  const e = setup(`<body><h1 id=h>Hello world</h1>
    <p id=p>  Click <a id=l href="#">here link</a> to <b>continue</b> now.  </p>
    <pre id=pre>pre block text</pre><p id=cd>Run <code id=c>npm install</code> first</p>
    <textarea id=ta>textarea text</textarea><input id=in value="input value">
    <p id=nt translate="no">Do not translate</p><div class="notranslate"><p id=nc>No class</p></div>
    <p id=ko>이것은 한국어 문장입니다</p><p id=ed contenteditable="true">editable text</p></body>`);
  const link = e.q('#l'); let clicks = 0; link.addEventListener('click', () => clicks++);
  const linkText = link.firstChild;
  const code = e.q('#c').firstChild;
  const before = structure(e.document.body);
  const st = e.start();
  assert.ok(st);
  await e.idle();
  assert.equal(e.q('#h').firstChild.nodeValue, 'KO:Hello world');
  assert.equal(e.q('#p').firstChild.nodeValue, '  KO:Click ');
  assert.equal(e.q('#p').lastChild.nodeValue, ' KO:now.  ');
  assert.equal(link.firstChild, linkText);
  assert.equal(linkText.nodeValue, 'here link');
  link.click(); assert.equal(clicks, 1);
  assert.equal(code.nodeValue, 'npm install');
  assert.equal(e.q('#pre').textContent, 'pre block text');
  assert.equal(e.q('#ta').textContent, 'textarea text');
  assert.equal(e.q('#in').value, 'input value');
  assert.equal(e.q('#nt').textContent, 'Do not translate');
  assert.equal(e.q('#nc').textContent, 'No class');
  assert.equal(e.q('#ko').textContent, '이것은 한국어 문장입니다');
  assert.equal(e.q('#ed').textContent, 'editable text');
  assert.equal(e.q('#cd').firstChild.nodeValue, 'KO:Run ');
  assert.equal(e.q('#h').getAttribute('lang'), 'ko');
  assert.equal(e.q('#h').getAttribute('data-kt'), 'done');
  assert.equal(structure(e.document.body), before);
  e.close();
});

test('main: x items are sent as context; request shape; batches in document order', async () => {
  const e = setup('<body><p>Click <a href="#">here</a> to <code>go</code> on.</p><p>Second paragraph</p></body>');
  e.start();
  await e.idle();
  assert.equal(e.messenger.translates.length, 1);
  const msg = e.messenger.translates[0];
  assert.equal(msg.lang, 'en');
  assert.equal(msg.context.host, 'example.com');
  assert.equal(msg.blocks.length, 2);
  loose.deepEqual(msg.blocks[0].items.map((i) => i.k + ':' + i.text), ['t:Click', 'x:here', 't:to', 'x:go', 't:on.']);
  assert.equal(msg.blocks[1].items[0].text, 'Second paragraph');
  // reportStatus 도 전송됨
  assert.ok(e.messenger.calls.some((c) => c.type === 'reportStatus' && c.done >= 2));
  e.close();
});

test('main: batches split by 40 blocks / 6000 chars and by language', async () => {
  const mk = (n, len) => Array.from({ length: n }, (_, i) => `<p>${'w'.repeat(len)} ${i}</p>`).join('');
  const e = setup(`<body>${mk(45, 10)}</body>`);
  e.start();
  await e.idle();
  loose.deepEqual(e.messenger.translates.map((m) => m.blocks.length), [40, 5]);
  e.close();
  const e2 = setup(`<body>${mk(8, 1500)}</body>`);
  e2.start();
  await e2.idle();
  assert.ok(e2.messenger.translates.length >= 2);
  for (const m of e2.messenger.translates) assert.ok(m.blocks.reduce((a, b) => a + b.items[0].text.length, 0) <= 6000);
  e2.close();
  const e3 = setup('<body><p>English sentence one</p><p>これは日本語の文です</p><p>Another English sentence</p></body>');
  e3.start();
  await e3.idle();
  loose.deepEqual(e3.messenger.translates.map((m) => m.lang), ['en', 'ja', 'en']);
  e3.close();
});

test('main: toggle roundtrip restores nodeValue exactly; toggleOriginal message', async () => {
  const e = setup('<body><p id=p>  Hello <b>big</b> world \n</p></body>');
  const nodes = () => textNodes(e.q('#p')).map((n) => n.nodeValue);
  const orig = nodes();
  e.start();
  await e.idle();
  const tr = nodes();
  assert.notDeepEqual(tr, orig);
  assert.equal(e.KT.main.handleMessage({ type: 'toggleOriginal' }).mode, 'original');
  loose.deepEqual(nodes(), orig);
  assert.equal(e.q('#p').getAttribute('lang'), null);
  await e.idle();
  loose.deepEqual(nodes(), orig, 'own writes do not trigger retranslation');
  assert.equal(e.KT.main.handleMessage({ type: 'toggleOriginal' }).mode, 'translated');
  loose.deepEqual(nodes(), tr);
  assert.equal(e.messenger.translates.length, 1);
  e.close();
});

test('main: response with <script> string stays text', async () => {
  const e = setup('<body><p id=p>Hello world</p></body>', { respond: (m) => fakeTranslateResponse(m, () => '<script>alert(1)</script>') });
  const before = structure(e.document.body);
  e.start();
  await e.idle();
  assert.equal(e.qa('script').length, 0);
  assert.equal(e.q('#p').textContent, '<script>alert(1)</script>');
  assert.equal(structure(e.document.body), before);
  e.close();
});

test('main: missing slots from engine (some / half or more) and error response', async () => {
  const html = '<body><p id=a>One <b>two</b> three <i>four</i> five</p><p id=b>One <b>two</b> three <i>four</i></p><p id=c>Whole error</p></body>';
  const e = setup(html, {
    respond: (m) => {
      const r = fakeTranslateResponse(m);
      for (const res of r.results) {
        const blk = m.blocks.find((b) => b.id === res.id);
        if (blk.items[0].text === 'One' && blk.items.length === 5) delete res.slots['2'];
        else if (blk.items[0].text === 'One') { delete res.slots['1']; delete res.slots['3']; }
        else delete res.slots['0'];
      }
      return r;
    },
  });
  e.start();
  await e.idle();
  assert.equal(e.q('#a').getAttribute('data-kt'), 'done');
  assert.equal(e.q('#a').childNodes[2].nodeValue, ' three ');
  assert.equal(e.q('#a').firstChild.nodeValue, 'KO:One ');
  assert.equal(e.q('#b').getAttribute('data-kt'), 'error');
  assert.equal(e.q('#b').firstChild.nodeValue, 'One ');
  assert.equal(e.q('#c').getAttribute('data-kt'), 'error');
  e.close();

  const e2 = setup('<body><p id=a>Hello world</p></body>', { respond: () => ({ ok: false, code: 'engine_unavailable', message: 'x' }) });
  e2.start();
  await e2.idle();
  assert.equal(e2.q('#a').firstChild.nodeValue, 'Hello world');
  assert.equal(e2.q('#a').getAttribute('data-kt'), 'error');
  e2.close();
  const e3 = setup('<body><p id=a>Hello world</p></body>', { respond: () => { throw new Error('boom'); } });
  e3.start();
  await e3.idle();
  assert.equal(e3.q('#a').getAttribute('data-kt'), 'error');
  e3.close();
});

test('main: node changed by page before apply is skipped', async () => {
  const d = deferred();
  const e = setup('<body><p id=a>Hello world</p><p id=b>Second one</p></body>', { respond: async (m) => { await d.promise; return fakeTranslateResponse(m); } });
  e.start();
  await sleep(40);
  assert.equal(e.messenger.translates.length, 1);
  e.q('#a').firstChild.nodeValue = 'Page rewrote this';
  d.resolve();
  await e.idle();
  assert.notEqual(e.q('#a').firstChild.nodeValue, 'KO:Hello world'); // 낡은 응답은 적용되지 않음
  assert.equal(e.q('#a').firstChild.nodeValue, 'KO:Page rewrote this'); // 변경된 값은 별도로 재번역
  assert.equal(e.q('#b').firstChild.nodeValue, 'KO:Second one');
  e.close();
});

test('dynamic: appended node translated, already translated blocks not re-requested', async () => {
  const e = setup('<body><div id=root><p>First paragraph</p></div></body>');
  e.start();
  await e.idle();
  assert.equal(e.messenger.translates.length, 1);
  const p = e.document.createElement('p');
  p.id = 'late'; p.textContent = 'Loaded later';
  e.q('#root').appendChild(p);
  await e.idle();
  assert.equal(e.messenger.translates.length, 2);
  assert.equal(e.messenger.translates[1].blocks.length, 1);
  assert.equal(e.messenger.translates[1].blocks[0].items[0].text, 'Loaded later');
  assert.equal(p.firstChild.nodeValue, 'KO:Loaded later');
  // 인접 요소 추가(상위 노드 이동)해도 이미 번역된 블록은 재요청 안 함
  const wrap = e.document.createElement('section');
  wrap.appendChild(e.q('#root'));
  e.document.body.appendChild(wrap);
  await e.idle();
  assert.equal(e.messenger.translates.length, 2);
  e.close();
});

test('dynamic: hidden block translated when it becomes visible', async () => {
  const e = setup('<body><p id=v>Visible text</p><p id=h>Hidden text</p></body>');
  e.io.hidden.add(e.q('#h'));
  e.start();
  await e.idle();
  assert.equal(e.q('#v').firstChild.nodeValue, 'KO:Visible text');
  assert.equal(e.q('#h').firstChild.nodeValue, 'Hidden text');
  assert.equal(e.messenger.translates.length, 1);
  e.io.show(e.q('#h'));
  await e.idle();
  assert.equal(e.q('#h').firstChild.nodeValue, 'KO:Hidden text');
  assert.equal(e.messenger.translates.length, 2);
  e.close();
});

test('dynamic: page reverting text is re-applied at most 3 times', async () => {
  const e = setup('<body><p id=p>Hello world</p></body>');
  e.start();
  await e.idle();
  const node = e.q('#p').firstChild;
  const seen = [];
  for (let i = 0; i < 5; i++) {
    node.nodeValue = 'Hello world';
    await e.idle();
    seen.push(node.nodeValue);
  }
  loose.deepEqual(seen, ['KO:Hello world', 'KO:Hello world', 'KO:Hello world', 'Hello world', 'Hello world']);
  assert.equal(e.q('#p').getAttribute('data-kt'), 'error');
  assert.equal(e.messenger.translates.length, 1, 'reapply uses record, no network');
  e.close();
});

test('dynamic: page writing a new value is retranslated', async () => {
  const e = setup('<body><p id=p>Hello world</p></body>');
  e.start();
  await e.idle();
  e.q('#p').firstChild.nodeValue = 'Brand new text';
  await e.idle();
  assert.equal(e.q('#p').firstChild.nodeValue, 'KO:Brand new text');
  assert.equal(e.messenger.translates.length, 2);
  e.close();
});

test('dynamic: replaced node with same text is applied from cache without network', async () => {
  const e = setup('<body><div id=root><p>Same sentence here</p></div></body>');
  e.start();
  await e.idle();
  assert.equal(e.messenger.translates.length, 1);
  const np = e.document.createElement('p');
  np.textContent = 'Same sentence here';
  e.q('#root').replaceChildren(np);
  await e.idle();
  assert.equal(np.firstChild.nodeValue, 'KO:Same sentence here');
  assert.equal(e.messenger.translates.length, 1);
  assert.equal(e.KT.main.state.metrics.cacheHits, 1);
  e.close();
});

test('dynamic: result for a removed node is discarded', async () => {
  const d = deferred();
  const e = setup('<body><div id=root><p id=a>Hello world</p></div><p id=keep>Keep this</p></body>', { respond: async (m) => { await d.promise; return fakeTranslateResponse(m); } });
  e.start();
  await sleep(40);
  const a = e.q('#a'); const node = a.firstChild;
  a.remove();
  d.resolve();
  await e.idle();
  assert.equal(node.nodeValue, 'Hello world');
  assert.equal(a.getAttribute('data-kt'), 'pending');
  assert.equal(e.q('#keep').firstChild.nodeValue, 'KO:Keep this');
  assert.equal(e.KT.main.applier.records.every((r) => r.node.isConnected), true);
  e.close();
});

test('dynamic: bulk append is throttled per tick', async () => {
  const e = setup('<body><ul id=list></ul></body>');
  e.start({ tickLimit: 50 });
  await e.idle();
  const ul = e.q('#list');
  for (let i = 0; i < 230; i++) { const li = e.document.createElement('li'); li.textContent = 'Item number ' + i; ul.appendChild(li); }
  await e.idle(5000);
  const m = e.KT.main.state.metrics;
  assert.ok(m.ticks >= 5, 'ticks=' + m.ticks);
  assert.ok(m.maxUnitsPerTick <= 50, 'max=' + m.maxUnitsPerTick);
  assert.equal(e.qa('li').filter((li) => li.firstChild.nodeValue.startsWith('KO:')).length, 230);
  e.close();
});

test('dynamic: huge single subtree is split across ticks', async () => {
  const e = setup('<body><div id=host></div></body>');
  e.start({ tickLimit: 20 });
  await e.idle();
  const wrap = e.document.createElement('div');
  for (let i = 0; i < 100; i++) { const p = e.document.createElement('p'); p.textContent = 'Row text ' + i; wrap.appendChild(p); }
  e.q('#host').appendChild(wrap);
  await e.idle(5000);
  assert.ok(e.KT.main.state.metrics.maxUnitsPerTick <= 20);
  assert.equal(e.qa('p').every((p) => p.firstChild.nodeValue.startsWith('KO:')), true);
  e.close();
});

test('dynamic: open shadow root content is translated, including later additions', async () => {
  const e = setup('<body><div id=host></div></body>');
  const sr = e.q('#host').attachShadow({ mode: 'open' });
  const p = e.document.createElement('p'); p.textContent = 'Shadow paragraph';
  sr.appendChild(p);
  e.start();
  await e.idle();
  assert.equal(p.firstChild.nodeValue, 'KO:Shadow paragraph');
  const p2 = e.document.createElement('p'); p2.textContent = 'Added in shadow';
  sr.appendChild(p2);
  await e.idle();
  assert.equal(p2.firstChild.nodeValue, 'KO:Added in shadow');
  e.close();
});

test('main: SPA url change drops queue and requeues visible blocks', async () => {
  const e = setup('<body><p id=a>Page one text</p></body>');
  e.io.hidden.add(e.q('#a'));
  e.start({ debounceMs: 30 });
  await e.idle();
  e.io.show(e.q('#a')); // 큐에 들어감(아직 flush 전)
  assert.equal(e.KT.main.state.queue.length, 1);
  e.io.hidden.delete(e.q('#a'));
  e.win.history.pushState({}, '', '/next');
  assert.equal(e.KT.main.state.queue.length, 0);
  await e.idle();
  assert.equal(e.q('#a').firstChild.nodeValue, 'KO:Page one text'); // 재감지 후 번역
  assert.equal(e.messenger.translates.length, 1);
  e.close();
});

test('main: bootstrap skipped for Korean documents; stop restores history', async () => {
  const e = setup('<body><p>Hello world</p></body>', { htmlLang: 'ko-KR' });
  assert.equal(e.start(), null);
  assert.equal(e.messenger.translates.length, 0);
  e.close();
  const e2 = setup('<body><p>이것은 한국어로 작성된 문서입니다. 모든 내용이 한국어입니다.</p><p>Hello</p></body>');
  assert.equal(e2.start(), null);
  e2.close();
  const e3 = setup('<body><p>Hello world</p></body>');
  const orig = e3.win.history.pushState;
  e3.start();
  assert.notEqual(e3.win.history.pushState, orig);
  e3.KT.main.stop();
  assert.equal(e3.win.history.pushState, orig);
  e3.win.close();
});

test('main: works with chrome fallback sender and KT.lib.detectLang absent/present', async () => {
  const sent = [];
  const e = setup('<body><p id=a>Hello world</p></body>', { lang: true, start: { send: undefined } });
  e.win.chrome = { runtime: { sendMessage(msg, cb) { sent.push(msg.type); cb(msg.type === 'translate' ? fakeTranslateResponse(msg) : {}); } } };
  e.KT.main.start({ debounceMs: 5, mutationDebounceMs: 10, reportDebounceMs: 5, listen: false });
  await e.idle();
  assert.equal(e.q('#a').firstChild.nodeValue, 'KO:Hello world');
  assert.ok(sent.includes('translate'));
  e.close();
});
