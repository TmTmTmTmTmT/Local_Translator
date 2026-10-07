// 블라인드 평가용 단독 HTML 생성기: 코퍼스 + 결과(run 1)를 JSON으로 인라인한다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const benchDir = path.resolve(here, '..');

function parseArgs(argv) {
  const o = { lang: null, engines: null, maxBlocks: 8, out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--lang') o.lang = argv[++i];
    else if (a === '--engines') o.engines = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--max-blocks') o.maxBlocks = Number(argv[++i]);
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--corpus-dir') o.corpusDir = argv[++i];
    else if (a === '--results-dir') o.resultsDir = argv[++i];
    else { console.error(`알 수 없는 인자: ${a}`); process.exit(2); }
  }
  return o;
}

// link 블록 전부 + seq 최소 1개를 먼저 확보하고, 나머지는 장르 라운드로빈으로 채운다.
export function sampleBlocks(blocks, max) {
  const picked = new Set();
  const link = blocks.filter((b) => b.genre === 'link');
  const seq = blocks.filter((b) => b.genre === 'seq');
  link.forEach((b) => picked.add(b));
  if (seq.length) picked.add(seq[0]);
  const byGenre = new Map();
  for (const b of blocks) {
    if (picked.has(b)) continue;
    if (!byGenre.has(b.genre)) byGenre.set(b.genre, []);
    byGenre.get(b.genre).push(b);
  }
  const queues = [...byGenre.values()];
  while (picked.size < max && queues.some((q) => q.length)) {
    for (const q of queues) {
      if (picked.size >= max) break;
      if (q.length) picked.add(q.shift());
    }
  }
  return blocks.filter((b) => picked.has(b)); // 문서 순서 유지
}

export function buildCandidate(block, res) {
  const rb = res && res.blocks ? res.blocks.find((b) => b.id === block.id) : null;
  const slots = rb && rb.slots ? rb.slots : null;
  let error = !res ? '결과 파일 없음' : !rb ? '블록 결과 없음' : rb.error || (rb.slots ? null : '슬롯 없음');
  let missing = false;
  const parts = [];
  for (const it of block.items) {
    if (it.k === 'x') parts.push({ k: 'x', text: it.text });
    else if (slots && typeof slots[String(it.i)] === 'string') parts.push({ k: 't', text: slots[String(it.i)] });
    else { missing = true; parts.push({ k: 'miss', text: '⟨누락⟩' }); }
  }
  return { engine: res ? res.engine : '(없음)', parts, error, missing: missing && !error };
}

export function buildData({ lang, corpus, results, maxBlocks }) {
  const blocks = sampleBlocks(corpus.blocks, maxBlocks).map((b) => ({
    id: b.id,
    genre: b.genre,
    source: b.items.map((it) => (it.k === 'x' ? { k: 'x', text: it.text } : { k: 't', text: it.text })),
    candidates: results.map((r) => buildCandidate(b, r)),
  }));
  return { lang, title: corpus.context && corpus.context.title, engines: results.map((r) => r.engine), blocks };
}

function main() {
  const o = parseArgs(process.argv.slice(2));
  if (!o.lang) { console.error('사용법: node bench/rate/build.mjs --lang en [--engines a,b] [--max-blocks 8] [--out file]'); process.exit(2); }
  const corpusDir = o.corpusDir ? path.resolve(o.corpusDir) : path.join(benchDir, 'corpus');
  const resultsDir = o.resultsDir ? path.resolve(o.resultsDir) : path.join(benchDir, 'results');
  const out = path.resolve(o.out || path.join(here, `rate-${o.lang}.html`));
  const corpusPath = path.join(corpusDir, `${o.lang}.json`);

  let data;
  if (!fs.existsSync(corpusPath)) {
    const message = `코퍼스 파일이 없습니다: ${corpusPath}`;
    console.error(message);
    data = { lang: o.lang, engines: [], blocks: [], message };
  } else {
    const corpus = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));
    let files = fs.existsSync(resultsDir)
      ? fs.readdirSync(resultsDir).filter((f) => f.endsWith(`__${o.lang}__r1.json`))
      : [];
    let results = files.map((f) => JSON.parse(fs.readFileSync(path.join(resultsDir, f), 'utf8')));
    if (o.engines) {
      const missing = o.engines.filter((e) => !results.some((r) => r.engine === e));
      if (missing.length) console.error(`경고: 결과 없는 엔진 제외: ${missing.join(', ')}`);
      results = o.engines.map((e) => results.find((r) => r.engine === e)).filter(Boolean);
    }
    results.sort((a, b) => a.engine.localeCompare(b.engine));
    if (!results.length) {
      const message = `결과 파일이 없습니다 (${resultsDir}/*__${o.lang}__r1.json). 벤치 실행 후 다시 생성하세요.`;
      console.error(message);
      data = { lang: o.lang, engines: [], blocks: [], message };
    } else {
      data = buildData({ lang: o.lang, corpus, results, maxBlocks: o.maxBlocks });
      console.log(`엔진 ${results.length}개: ${data.engines.join(', ')} / 블록 ${data.blocks.length}개 (${data.blocks.map((b) => b.id).join(', ')})`);
    }
  }

  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const rd = (f) => fs.readFileSync(path.join(here, f), 'utf8');
  // 함수 치환자를 써서 `$&` 등 특수 패턴 해석을 피한다.
  const html = rd('rate.html')
    .replace('/*__CSS__*/', () => rd('rate.css'))
    .replace('/*__JS__*/', () => rd('rate.js'))
    .replace('__DATA__', () => json);
  fs.writeFileSync(out, html);
  console.log(`생성: ${out}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
