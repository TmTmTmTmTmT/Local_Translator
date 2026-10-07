import test from 'node:test';
import assert from 'node:assert/strict';
import loose from 'node:assert'; // jsdom 영역 배열은 프로토타입이 달라 loose 비교 사용
import { setup, structure, textNodes } from './helpers/load-content.mjs';

function env(html, opts) { return setup(html, opts); }

test('text: cleanText / isNonlinguistic / withOuterWhitespace / hangulRatio', () => {
  const e = env('<body></body>');
  const T = e.KT.text;
  assert.equal(T.cleanText('  a​b  '), 'ab');
  for (const s of ['', '   ', '12345', '— • 42 %', 'https://example.com/a?b=1', 'www.foo.com', 'me@example.com']) assert.equal(T.isNonlinguistic(s), true, s);
  for (const s of ['Hello', '日本語', 'see https://x.com now', '안녕']) assert.equal(T.isNonlinguistic(s), false, s);
  assert.equal(T.withOuterWhitespace('  Hello \n', 'KO:Hello'), '  KO:Hello \n');
  assert.equal(T.withOuterWhitespace('Hello', ' 번역 '), '번역');
  assert.equal(T.withOuterWhitespace('x ', ''), ' ');
  assert.ok(T.hangulRatio('안녕하세요') === 1);
  assert.ok(T.hangulRatio('Hello 안') < 0.5);
  assert.equal(T.hangulRatio('123'), 0);
  assert.equal(T.detectLang('Hello world'), 'en');
  assert.equal(T.detectLang('これは日本語です'), 'ja');
  assert.equal(T.detectLang('这是中文句子'), 'zh');
  assert.equal(T.detectLang('이것은 한국어'), 'ko');
  e.close();
});

test('text: detectLang is self-contained and matches lib/lang.js', async () => {
  const e = env('<body></body>');
  const lang = (await import('node:module')).createRequire(import.meta.url)('../extension/lib/lang.js');
  const samples = ['Hello world', 'これは日本語です', '这是中文句子', '이것은 한국어', '漢字 and English words here', '12345', '', 'https://a.com', '東京 Tokyo', '我们的国家 is big'];
  for (const t of samples) assert.equal(e.KT.text.detectLang(t), lang.detectLang(t), t);
  e.close();
});

test('filter: exclusion rules', () => {
  const e = env(`<body><p id=a>x</p><a id=b href="#"><span id=b2>y</span></a><pre id=c><b id=c2>z</b></pre>
    <code id=d>q</code><kbd id=d2>k</kbd><samp id=d3>s</samp><var id=d4>v</var><tt id=d5>t</tt>
    <textarea id=f>t</textarea><select id=g><option id=g2>o</option></select><div translate="no" id=h><p id=h2>n</p></div>
    <div class="notranslate" id=i><span id=i2>n</span></div><div contenteditable="true" id=j><b id=j2>n</b></div>
    <div contenteditable="" id=j3>n</div><div contenteditable="false" id=j4>n</div><div data-kt-ui id=k><b id=k2>u</b></div>
    <div class="site-x" id=l><b id=l2>u</b></div><script id=m>1</script><style id=m2>a{}</style><button id=n>Go</button></body>`);
  const F = e.KT.filter;
  const ex = (id, o) => F.isExcluded(e.q('#' + id), o);
  for (const id of ['b', 'b2', 'c', 'c2', 'd', 'd2', 'd3', 'd4', 'd5', 'f', 'g', 'g2', 'h', 'h2', 'i', 'i2', 'j', 'j2', 'j3', 'k', 'k2', 'm', 'm2']) assert.equal(ex(id), true, id);
  for (const id of ['a', 'j4', 'l', 'l2', 'n']) assert.equal(ex(id), false, id);
  assert.equal(ex('l2', { excludeSelector: '.site-x' }), true);
  assert.equal(ex('l2'), false, 'cache is selector specific');
  assert.equal(ex('l2', { excludeSelector: ':::bad' }), false, 'invalid selector ignored');
  assert.equal(F.exclusionReason(e.q('#b2')), 'keep');
  assert.equal(F.exclusionReason(e.q('#m')), 'skip');
  assert.equal(F.blockOf(e.q('#b2').firstChild), e.q('body'));
  assert.equal(F.blockOf(e.q('#a').firstChild), e.q('#a'));
  e.close();
});

test('segmenter: slots, x items, nested blocks, limits, skipping', () => {
  const e = env(`<body><p id=p1>Click <a href="#">here</a> to <b>continue</b> now.</p>
    <div id=d>Intro text <p id=p2>Inner paragraph</p> tail text</div>
    <p id=k>이것은 한국어 문장입니다</p><p id=n>12345</p><p id=u>Это русский текст</p>
    <p id=c>Run <code>npm test</code> please</p><p id=only><a href="#">only link</a></p></body>`);
  const recs = e.KT.collectBlocks(e.document.body, {});
  const byEl = (id) => recs.filter((r) => r.el.id === id);
  const p1 = byEl('p1')[0];
  loose.deepEqual(p1.block.items.map((i) => [i.k, i.text]), [['t', 'Click'], ['x', 'here'], ['t', 'to'], ['t', 'continue'], ['t', 'now.']]);
  loose.deepEqual(p1.block.items.filter((i) => i.k === 't').map((i) => i.i), [0, 1, 2, 3]);
  assert.equal(p1.block.lang, 'en');
  assert.equal(p1.slots.length, 4);
  assert.equal(byEl('d').length, 2, 'text around a nested block splits into separate records');
  assert.equal(byEl('p2').length, 1);
  assert.equal(byEl('k').length + byEl('n').length + byEl('u').length + byEl('only').length, 0);
  loose.deepEqual(byEl('c')[0].block.items.map((i) => i.k), ['t', 'x', 't']);
  assert.equal(new Set(recs.map((r) => r.id)).size, recs.length);
  e.close();
});

test('segmenter: block char limit splits records; handled nodes become x', () => {
  const long = 'word '.repeat(300); // 1500자
  const e = env(`<body><p id=p>${long}<b>${long}</b></p></body>`);
  const recs = e.KT.collectBlocks(e.document.body, { maxBlockChars: 2000 });
  assert.equal(recs.length, 2);
  for (const r of recs) assert.ok(r.chars <= 2000);
  const handled = new Set([recs[0].slots[0].node]);
  const again = e.KT.collectBlocks(e.document.body, { maxBlockChars: 2000, isHandled: (n) => handled.has(n) });
  assert.equal(again.length, 1);
  assert.equal(again[0].block.items.filter((i) => i.k === 'x').length, 1);
  e.close();
});

test('apply: only nodeValue/lang/data-kt change, whitespace, toggle roundtrip, lang restored', () => {
  const e = env('<body><p id=p lang="en-US">  Hello <a id=l href="#">link</a> world  </p></body>');
  let clicked = 0;
  const link = e.q('#l');
  link.addEventListener('click', () => clicked++);
  const linkText = link.firstChild;
  const before = structure(e.document.body);
  const [rec] = e.KT.collectBlocks(e.document.body, {});
  const ap = e.KT.createApplier();
  const origValues = rec.slots.map((s) => s.node.nodeValue);
  const res = ap.apply(rec, { 0: 'A', 1: 'B' });
  assert.equal(res.status, 'done');
  loose.deepEqual(rec.slots.map((s) => s.node.nodeValue), ['  A ', ' B  ']);
  assert.equal(e.q('#p').getAttribute('lang'), 'ko');
  assert.equal(e.q('#p').getAttribute('data-kt'), 'done');
  assert.equal(link.firstChild, linkText);
  assert.equal(linkText.nodeValue, 'link');
  link.click(); assert.equal(clicked, 1);
  assert.equal(structure(e.document.body), before);
  assert.equal(ap.records.length, 2);
  ap.showOriginal();
  loose.deepEqual(rec.slots.map((s) => s.node.nodeValue), origValues);
  assert.equal(e.q('#p').getAttribute('lang'), 'en-US');
  ap.showTranslation();
  loose.deepEqual(rec.slots.map((s) => s.node.nodeValue), ['  A ', ' B  ']);
  ap.showOriginal(); ap.showOriginal(); ap.showTranslation(); ap.showTranslation();
  ap.showOriginal();
  loose.deepEqual(rec.slots.map((s) => s.node.nodeValue), origValues);
  e.close();
});

test('apply: <script> in response stays text', () => {
  const e = env('<body><p id=p>Hello world</p></body>');
  const [rec] = e.KT.collectBlocks(e.document.body, {});
  const before = structure(e.document.body);
  e.KT.createApplier().apply(rec, { 0: '<script>alert(1)</script><img src=x onerror=1>' });
  assert.equal(e.qa('script,img').length, 0);
  assert.equal(structure(e.document.body), before);
  assert.equal(rec.slots[0].node.nodeValue, '<script>alert(1)</script><img src=x onerror=1>');
  e.close();
});

test('apply: missing slots (some -> keep original, >= half -> whole block original + error)', () => {
  const e = env('<body><p id=a>One <b>two</b> three <i>four</i> five</p><p id=b>One <b>two</b> three <i>four</i></p></body>');
  const [ra, rb] = e.KT.collectBlocks(e.document.body, {});
  const ap = e.KT.createApplier();
  assert.equal(ap.apply(ra, { 0: 'A', 1: 'B', 3: 'D', 4: 'E' }).status, 'done'); // slot 2 누락 (1/5)
  loose.deepEqual(ra.slots.map((s) => s.node.nodeValue), ['A ', 'B', ' three ', 'D', ' E']);
  assert.equal(ra.slots[2].node.nodeValue, ra.slots[2].original);
  const origB = rb.slots.map((s) => s.node.nodeValue);
  const r = ap.apply(rb, { 0: 'A', 2: 'C' }); // 2/4 누락 -> 절반 이상
  assert.equal(r.status, 'error');
  loose.deepEqual(rb.slots.map((s) => s.node.nodeValue), origB);
  assert.equal(e.q('#b').getAttribute('data-kt'), 'error');
  assert.equal(e.q('#b').getAttribute('lang'), null);
  e.close();
});

test('apply: node changed by page / disconnected before apply is skipped', () => {
  const e = env('<body><p id=a>One <b>two</b> three</p></body>');
  const [rec] = e.KT.collectBlocks(e.document.body, {});
  rec.slots[0].node.nodeValue = 'Page changed ';
  rec.slots[2].node.remove();
  const ap = e.KT.createApplier();
  const r = ap.apply(rec, { 0: 'A', 1: 'B', 2: 'C' });
  assert.equal(r.skipped, 2);
  assert.equal(rec.slots[0].node.nodeValue, 'Page changed ');
  assert.equal(rec.slots[1].node.nodeValue, 'B');
  assert.equal(ap.records.length, 1);
  e.close();
});

test('apply: reapply is limited to 3 per node; own value detection; prune', () => {
  const e = env('<body><p id=a>Hello world</p></body>');
  const [rec] = e.KT.collectBlocks(e.document.body, {});
  const ap = e.KT.createApplier();
  ap.apply(rec, { 0: 'T' });
  const node = rec.slots[0].node;
  assert.equal(ap.isOwnValue(node), true);
  const results = [];
  for (let i = 0; i < 5; i++) { node.nodeValue = 'Hello world'; results.push(ap.reapply(node)); }
  loose.deepEqual(results, ['reapplied', 'reapplied', 'reapplied', 'gaveup', 'ignored']);
  assert.equal(node.nodeValue, 'Hello world');
  assert.equal(e.q('#a').getAttribute('data-kt'), 'error');
  node.remove();
  assert.equal(ap.prune(), 1);
  assert.equal(ap.records.length, 0);
  e.close();
});

test('apply: no DOM-creating APIs in content sources', async () => {
  const { readFileSync } = await import('node:fs');
  const { join, dirname } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'extension', 'content');
  for (const f of ['text.js', 'filter.js', 'segmenter.js', 'apply.js', 'main.js', 'extra.js']) {
    const s = readFileSync(join(dir, f), 'utf8');
    assert.doesNotMatch(s, /innerHTML|outerHTML|insertAdjacentHTML|\.createElement\(|appendChild|insertBefore|\.remove\(\)/, f);
  }
});
