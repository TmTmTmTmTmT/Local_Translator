// pdfseg 순수 함수 단위 테스트 (합성 items). node:vm으로 클래식 스크립트 로드.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'extension', 'viewer', 'pdfseg.js');
const sandbox = { console };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: 'pdfseg.js' });
const seg = sandbox.KT.pdfseg;

const W = 612;
const H = 792;
// 좌상단 기준 (x, top-baseline y) -> PDF 공간 item
const it = (str, x, y, o = {}) => ({
  str, transform: [o.size || 10, 0, 0, o.size || 10, x, H - y], width: o.width != null ? o.width : str.length * (o.size || 10) * 0.5,
  height: o.size || 10, fontName: o.font || 'f1', hasEOL: false,
});
const page = (items, extra = {}) => ({ page: extra.page || 1, width: W, height: H, items, links: extra.links || [], fonts: extra.fonts || {} });
// 줄 하나 = 한 item
const lines = (x, y0, texts, o = {}) => texts.map((t, i) => it(t, x, y0 + i * 12, o));
const texts = (r) => r.map((p) => p.text);

test('single column: lines joined into paragraphs by gap', () => {
  const items = [...lines(72, 100, ['The quick brown fox', 'jumps over the lazy dog.']), ...lines(72, 100 + 12 + 24, ['Second paragraph starts', 'here and ends.'])];
  const r = seg.segmentPage(page(items));
  assert.deepEqual(texts(r), ['The quick brown fox jumps over the lazy dog.', 'Second paragraph starts here and ends.']);
  assert.equal(r[0].id, 'p1-0');
  assert.deepEqual(r[0].items, [{ k: 't', i: 0, text: r[0].text }]);
  assert.equal(r[0].bbox[0], 72);
});

test('first-line indent starts new paragraph', () => {
  const items = [it('Alpha beta gamma', 90, 100), it('delta epsilon', 72, 112), it('Zeta eta theta', 90, 124), it('iota kappa', 72, 136)];
  assert.equal(seg.segmentPage(page(items)).length, 2);
});

test('font size change starts new paragraph (heading)', () => {
  const items = [it('Introduction', 72, 80, { size: 16 }), it('Body text here', 72, 100), it('continues', 72, 112)];
  assert.deepEqual(texts(seg.segmentPage(page(items))), ['Introduction', 'Body text here continues']);
});

test('hyphenation joined when next line starts lowercase', () => {
  const r = seg.segmentPage(page(lines(72, 100, ['This is an exam-', 'ple of text.'])));
  assert.equal(r[0].text, 'This is an example of text.');
});

test('hyphen kept (no space) when next starts uppercase; soft hyphen removed', () => {
  assert.equal(seg.segmentPage(page(lines(72, 100, ['Anglo-', 'Saxon era'])))[0].text, 'Anglo-Saxon era');
  assert.equal(seg.segmentPage(page(lines(72, 100, ['inter­', 'national')))) [0].text, 'international');
});

test('CJK lines joined without space', () => {
  const r = seg.segmentPage(page(lines(72, 100, ['これは日本語の', 'テキストです。'])));
  assert.equal(r[0].text, 'これは日本語のテキストです。');
  const z = seg.segmentPage(page(lines(72, 100, ['这是中文', '文本。'])));
  assert.equal(z[0].text, '这是中文文本。');
});

test('two columns: reading order column by column', () => {
  const left = ['L one', 'L two', 'L three', 'L four', 'L five', 'L six'];
  const right = ['R one', 'R two', 'R three', 'R four', 'R five', 'R six'];
  const items = [...lines(50, 100, left, { width: 240 }), ...lines(320, 100, right, { width: 240 })];
  const r = seg.segmentPage(page(items));
  assert.equal(r.length, 2);
  assert.equal(r[0].text, left.join(' '));
  assert.equal(r[1].text, right.join(' '));
});

test('wide heading above two columns comes first', () => {
  const left = ['L one', 'L two', 'L three', 'L four', 'L five', 'L six'];
  const right = ['R one', 'R two', 'R three', 'R four', 'R five', 'R six'];
  const items = [it('Big Title Across', 50, 60, { size: 18, width: 500 }), ...lines(50, 100, left, { width: 240 }), ...lines(320, 100, right, { width: 240 })];
  const r = seg.segmentPage(page(items));
  assert.equal(r[0].text, 'Big Title Across');
  assert.equal(r[1].text, left.join(' '));
  assert.equal(r[2].text, right.join(' '));
});

test('repeated header/footer and bare page numbers dropped', () => {
  const pages = [1, 2, 3, 4].map((n) => page([
    it('Journal of Tests', 72, 30), ...lines(72, 100, [`Body line for page ${n} with words`]), it(String(n), 300, 760),
  ], { page: n }));
  const r = seg.segmentDocument(pages);
  assert.equal(r.pages.length, 4);
  r.pages.forEach((p, i) => assert.deepEqual(texts(p), [`Body line for page ${i + 1} with words`]));
});

test('repeated rule: header with digits, margin only; body repeats kept', () => {
  const pages = [1, 2, 3].map((n) => page([it(`Report 2024 - ${n}`, 72, 30), ...lines(72, 300, ['Same body text'])], { page: n }));
  const r = seg.segmentDocument(pages);
  r.pages.forEach((p) => assert.deepEqual(texts(p), ['Same body text']));
});

test('link overlap becomes x item and order is preserved', () => {
  const items = [it('See ', 72, 100, { width: 20 }), it('example.org', 92, 100, { width: 55 }), it(' for details here.', 147, 100, { width: 90 })];
  // link rect in PDF space: [x1,y1,x2,y2]
  const r = seg.segmentPage(page(items, { links: [[90, H - 104, 150, H - 98]] }));
  assert.deepEqual(r[0].items.map((x) => x.k), ['t', 'x', 't']);
  assert.equal(r[0].items[1].text, 'example.org');
  assert.equal(r[0].items[0].text, 'See ');
  assert.equal(r[0].text, 'See example.org for details here.');
  assert.deepEqual(r[0].items.filter((x) => x.k === 't').map((x) => x.i), [0, 1]);
});

test('link covering part of one item splits it', () => {
  const str = 'Visit the docs site now';
  const items = [it(str, 72, 100, { width: 230 })]; // 10 per char
  const r = seg.segmentPage(page(items, { links: [[72 + 100, H - 104, 72 + 140, H - 98]] })); // chars 10..14 'docs'
  assert.deepEqual(r[0].items.map((x) => x.k), ['t', 'x', 't']);
  assert.equal(r[0].items[1].text, 'docs');
});

test('monospace font becomes x', () => {
  const items = [it('Call ', 72, 100, { width: 25 }), it('foo_bar()', 97, 100, { width: 45, font: 'g_font_1' }), it(' to start.', 142, 100, { width: 50 })];
  const r = seg.segmentPage(page(items, { fonts: { g_font_1: { fontFamily: 'Courier New, monospace' } } }));
  assert.deepEqual(r[0].items.map((x) => x.k), ['t', 'x', 't']);
  const r2 = seg.segmentPage(page([it('run ', 72, 100, { width: 20 }), it('ls -la', 92, 100, { width: 30, font: 'Consolas-Bold' })]));
  assert.equal(r2[0].items[1].k, 'x');
});

test('nonlinguistic paragraph is only x', () => {
  const r = seg.segmentPage(page(lines(72, 100, ['3.14 + 2 = 5.14'])));
  assert.deepEqual(r[0].items.map((x) => x.k), ['x']);
});

test('vertical writing -> unsupported', () => {
  const items = [it('縦書き', 300, 100), it('テスト', 330, 100)];
  const r = seg.segmentPage(page(items, { fonts: { f1: { vertical: true } } }));
  assert.deepEqual(JSON.parse(JSON.stringify(r)), { unsupported: 'vertical' });
  assert.equal(seg.segmentDocument([page(items, { fonts: { f1: { vertical: true } } })]).unsupported, 'vertical');
});

test('no text -> unsupported no-text', () => {
  assert.equal(seg.segmentPage(page([])).unsupported, 'no-text');
  assert.equal(seg.segmentPage(page([it('   ', 72, 100)])).unsupported, 'no-text');
  assert.equal(seg.segmentDocument([page([]), page([])]).unsupported, 'no-text');
});

test('rotated side stamp ignored', () => {
  const stamp = { str: 'arXiv:1234.5678 stamp', transform: [0, 10, -10, 0, 20, 400], width: 100, height: 10, fontName: 'f1' };
  const r = seg.segmentPage(page([stamp, ...lines(72, 100, ['Real text here'])]));
  assert.deepEqual(texts(r), ['Real text here']);
});

test('superscript stays on the same line', () => {
  const items = [it('E equals mc', 72, 100, { width: 60 }), it('2', 132, 96, { size: 6, width: 3 }), it(' in physics.', 135, 100, { width: 60 })];
  const r = seg.segmentPage(page(items));
  assert.equal(r.length, 1);
  assert.match(r[0].text, /mc2 in physics\./);
});
