// Regenerates tests/e2e/sample.pdf (2 pages, one URI link over "online guide"). Usage: node tests/e2e/make-sample-pdf.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Helvetica 11pt: "See the " = 3.725 em-thousandths*11 -> starts x=72+40.975; "online guide" is 5.392 em wide.
export const LINK_RECT = [112.9, 648, 172.4, 662];

const content = (n) => [
  'BT /F1 9 Tf 72 760 Td (Local Translator Test Report) Tj ET',
  `BT /F1 18 Tf 72 720 Td (Section ${n}: Network settings) Tj ET`,
  'BT /F1 11 Tf 72 690 Td (The server listens on port 8080 by default. You can change it in the) Tj ET',
  'BT /F1 11 Tf 72 676 Td (configuration file, but remember to restart the service afterwards.) Tj ET',
  'BT /F1 11 Tf 72 650 Td (See the online guide for details about advanced options and) Tj ET',
  'BT /F1 11 Tf 72 636 Td (troubleshooting steps that are not covered in this short document.) Tj ET',
  `BT /F1 9 Tf 72 40 Td (Page ${n}) Tj ET`,
].join('\n');

const annot = `<< /Type /Annot /Subtype /Link /Rect [${LINK_RECT.join(' ')}] /Border [0 0 0] /A << /S /URI /URI (https://example.com/guide) >> >>`;
const stream = (c) => `<< /Length ${c.length} >>\nstream\n${c}\nendstream`;
const page = (contents, annots) => `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contents} 0 R /Annots [${annots} 0 R] >>`;
const objs = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Count 2 /Kids [6 0 R 9 0 R] >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  stream(content(1)), annot, page(4, 5),
  stream(content(2)), annot, page(7, 8),
];
let out = '%PDF-1.4\n';
const offs = [];
objs.forEach((o, i) => { offs.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
const xref = out.length;
out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('');
out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
fs.writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'sample.pdf'), Buffer.from(out, 'latin1'));
