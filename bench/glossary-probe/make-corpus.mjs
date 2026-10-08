// Glossary probe: apply extension glossary to the article corpus (same code path as background) and write a substituted corpus.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const g = require('../../extension/lib/glossary.js');
const terms = g.normalize([
  { src: 'kerbs', dst: '연석' }, { src: 'safety car', dst: '세이프티카' }, { src: 'undercut', dst: '언더컷' },
  { src: 'pit wall', dst: '피트월' }, { src: 'backmarkers', dst: '백마커' },
]);
const c = JSON.parse(fs.readFileSync(new URL('../corpus-articles/en.json', import.meta.url)));
const blocks = [];
const meta = [];
for (const b of c.blocks) {
  const r = g.applyToItems(b.items, 'en', terms);
  if (r.applied.length) { blocks.push({ ...b, items: r.items }); meta.push({ id: b.id, applied: r.applied }); }
}
fs.writeFileSync(new URL('./corpus/en.json', import.meta.url), JSON.stringify({ ...c, blocks }, null, 1));
fs.writeFileSync(new URL('./applied.json', import.meta.url), JSON.stringify(meta, null, 1));
console.log(JSON.stringify(meta));
