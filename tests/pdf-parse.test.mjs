// 벤더링된 pdf.min.mjs로 손으로 만든 최소 PDF를 파싱 -> pdfseg 통과 (DOM 불필요한 getTextContent 경로만).
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'extension');

function makePdf(lines) {
  const content = 'BT /F1 12 Tf 14 TL 72 700 Td ' + lines.map((l) => `(${l}) Tj T*`).join(' ') + ' ET';
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let out = '%PDF-1.4\n';
  const offs = [];
  objs.forEach((o, i) => { offs.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('');
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Uint8Array(Buffer.from(out, 'latin1'));
}

test('vendored pdf.js parses a hand-written PDF and pdfseg segments it', async (t) => {
  // Node 22 lacks Promise.try (pdf.js 6 needs it); Safari 18.2+/macOS 26 has it natively.
  if (!Promise.try) Promise.try = (f, ...a) => new Promise((r) => r(f(...a)));
  if (!Uint8Array.prototype.toHex) Uint8Array.prototype.toHex = function () { return Array.from(this, (b) => b.toString(16).padStart(2, '0')).join(''); };
  let pdfjs;
  try {
    pdfjs = await import(pathToFileURL(path.join(root, 'vendor/pdfjs/build/pdf.min.mjs')).href);
  } catch (e) { t.skip('pdf.min.mjs not loadable in node: ' + e.message); return; }
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.join(root, 'vendor/pdfjs/build/pdf.worker.min.mjs')).href;
  const sandbox = { console };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, 'viewer/pdfseg.js'), 'utf8'), sandbox);
  const task = pdfjs.getDocument({
    data: makePdf(['Hello wor-', 'ld from the test.']), useSystemFonts: false, isEvalSupported: false,
    standardFontDataUrl: pathToFileURL(path.join(root, 'vendor/pdfjs/standard_fonts') + '/').href,
    disableFontFace: true, verbosity: 0,
  });
  const doc = await task.promise;
  const page = await doc.getPage(1);
  const vp = page.getViewport({ scale: 1 });
  const tc = await page.getTextContent();
  const res = JSON.parse(JSON.stringify(sandbox.KT.pdfseg.segmentPage({
    page: 1, width: vp.width, height: vp.height, viewTransform: vp.transform, items: tc.items, links: [], fonts: tc.styles,
  })));
  assert.equal(res.length, 1);
  assert.equal(res[0].text, 'Hello world from the test.');
  await task.destroy();
});
