// Reads results/*.json (+ monitor CSVs, scenario files, power logs, ratings) and writes bench/REPORT.md.
//   node bench/summarize.mjs [--results-dir d] [--corpus-dir d] [--out REPORT.md] [--no-sbs]
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from './lib/cli.mjs';
import { loadCorpus } from './lib/corpus.mjs';
import { aggregateResults, speedMetrics } from './lib/metrics.mjs';
import { percentile, median } from './lib/timing.mjs';
import { parseMonitorCsv, analyzeMonitor, parsePowermetrics, flattenRatings, summarizeRatings } from './lib/monitor.mjs';

const BENCH = dirname(fileURLToPath(import.meta.url));
export const LIMITS = { p50Ms: 500, preserve: 0.95, addedMb: 1536 };

const pct = (v) => (v === null || v === undefined ? '-' : `${(v * 100).toFixed(0)}%`);
const ms = (v) => (v === null || v === undefined ? '-' : `${Math.round(v)}`);
const num = (v, d = 1) => (v === null || v === undefined ? '-' : v.toFixed(d));
const mb = (kb) => (kb === null || kb === undefined ? '-' : `${(kb / 1024).toFixed(0)}MB`);

export function loadResults(dir) {
  const groups = new Map(); // `${engine}\t${lang}` -> results[]
  if (!existsSync(dir)) return groups;
  for (const f of readdirSync(dir).sort()) {
    if (!f.endsWith('.json') || f.startsWith('scenario__') || f.startsWith('ratings')) continue;
    if (!/__r\d+\.json$/.test(f)) continue;
    let r;
    try { r = JSON.parse(readFileSync(join(dir, f), 'utf8')); } catch { continue; }
    if (!r.engine || !r.lang || !Array.isArray(r.blocks)) continue;
    const k = `${r.engine}\t${r.lang}`;
    (groups.get(k) || groups.set(k, []).get(k)).push(r);
  }
  return groups;
}

export function loadScenarios(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.startsWith('scenario__') && f.endsWith('.json')).sort()
    .map((f) => { try { return JSON.parse(readFileSync(join(dir, f), 'utf8')); } catch { return null; } }).filter(Boolean);
}

export function loadMonitors(dir) {
  const out = []; // {engine, scenario, analysis}
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir).sort()) {
    const m = f.match(/^monitor__(.+?)__(.+)\.csv$/);
    if (!m) continue;
    out.push({ engine: m[1], scenario: m[2], analysis: analyzeMonitor(parseMonitorCsv(readFileSync(join(dir, f), 'utf8'))) });
  }
  return out;
}

export function loadPower(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir).sort()) {
    const m = f.match(/^power_(.+)\.log$/);
    if (m) out.push({ engine: m[1], stats: parsePowermetrics(readFileSync(join(dir, f), 'utf8')) });
  }
  return out;
}

export function loadRatings(dir) {
  const flat = [];
  if (!existsSync(dir)) return flat;
  for (const f of readdirSync(dir).sort()) {
    if (!/^ratings(-.+)?\.json$/.test(f)) continue;
    try { flat.push(...flattenRatings(JSON.parse(readFileSync(join(dir, f), 'utf8')), f.match(/^ratings-(.+)\.json$/)?.[1])); } catch { /* ignore bad file */ }
  }
  return flat;
}

// PASS / FAIL / N/A for a "value <= limit" or ">= limit" check.
const check = (v, ok) => (v === null || v === undefined ? 'N/A' : ok(v) ? 'PASS' : 'FAIL');

// Resource verdict per engine from monitor analyses (prefers usage-sim, falls back to any other scenario).
export function resourceVerdict(engine, monitors) {
  const mine = monitors.filter((m) => m.engine === engine);
  const sim = mine.find((m) => m.scenario === 'usage-sim') || mine.find((m) => m.scenario === 'resident') || mine[0];
  if (!sim) return { mem: 'N/A', swap: 'N/A', unload: 'N/A', source: null };
  const a = sim.analysis;
  const idleSrc = mine.find((m) => m.analysis.unloaded !== null) || sim;
  return {
    mem: check(a.peakTotalKb / 1024, (v) => v <= LIMITS.addedMb),
    swap: check(a.swapDeltaPages, (v) => v <= 0),
    unload: idleSrc.analysis.unloaded === null ? 'N/A' : idleSrc.analysis.unloaded ? 'PASS' : 'FAIL',
    source: sim.scenario,
  };
}

export function hardConditions(engine, speed, agg, monitors) {
  const res = resourceVerdict(engine, monitors);
  const slot = check(agg.slotReturnRate, (v) => v >= LIMITS.preserve);
  const xr = check(agg.xPreservationRate, (v) => v >= LIMITS.preserve);
  const rows = {
    p50: check(speed.warmP50, (v) => v <= LIMITS.p50Ms),
    slot: slot === 'FAIL' || xr === 'FAIL' ? 'FAIL' : slot,
    mem: res.mem, swap: res.swap, unload: res.unload,
  };
  const vals = Object.values(rows);
  rows.overall = vals.includes('FAIL') ? 'FAIL' : vals.includes('N/A') ? 'PENDING' : 'PASS';
  return rows;
}

function reconstruct(block, slots) {
  return block.items.map((it) => {
    if (it.k === 'x') return `[${it.text}]`;
    const v = slots ? slots[String(it.i)] : undefined;
    return v === undefined ? '(누락)' : v;
  }).join('');
}

const esc = (s) => String(s).replace(/\r?\n/g, ' ').replace(/\|/g, '\\|');

export function buildReport({ groups, corpora, scenarios, monitors, power, ratings, sbs = true }) {
  const L = [];
  const engines = [...new Set([...groups.keys()].map((k) => k.split('\t')[0]))].sort();
  const langs = [...new Set([...groups.keys()].map((k) => k.split('\t')[1]))].sort();
  L.push('# Phase 0 벤치마크 REPORT', '', `생성: ${new Date().toISOString()} · 엔진 ${engines.length} · 언어 ${langs.join(', ') || '-'}`, '');

  const table = [];
  L.push('## 1. 엔진 x 언어 요약', '',
    '| 엔진 | 언어 | runs | coldMs(r1) | warm p50 | warm p95 | 문서 ms (N블록) | 자/초 | 슬롯 반환 | x 보존 | JSON 유효 | 숫자 | URL | 고유명사 | 한글비율 | 미번역 | 길이이상 | 반복/환각 | 오류블록 |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const engine of engines) for (const lang of langs) {
    const rs = groups.get(`${engine}\t${lang}`);
    const corpus = corpora[lang];
    if (!rs || !corpus) continue;
    const sp = speedMetrics(corpus, rs), ag = aggregateResults(corpus, rs);
    table.push({ engine, lang, sp, ag });
    L.push(`| ${engine} | ${lang} | ${ag.runs} | ${ms(sp.coldMs)} | ${ms(sp.warmP50)}${sp.warmFallback ? '*' : ''} | ${ms(sp.warmP95)} | ${ms(sp.docMs)} (${sp.docBlocks}) | ${num(sp.charsPerSec, 0)} | ${pct(ag.slotReturnRate)} | ${pct(ag.xPreservationRate)} | ${pct(ag.jsonValidRate)} | ${pct(ag.numberRate)} | ${pct(ag.urlRate)} | ${pct(ag.nameRate)} | ${pct(ag.hangulMean)} | ${ag.untranslatedBlocks} | ${ag.lenOutliers} | ${ag.repeatFlags} | ${ag.errorBlocks} |`);
  }
  L.push('', '- warm = run 2+ 전체 + run 1의 첫 배치 제외 블록 (`*` = 표본 부족으로 콜드 포함). 블록 ms는 배치 시간/블록 수.',
    '- x 보존: 결과에 `xPreserved`를 기록하는 엔진만 표시 (LLM 어댑터는 x를 출력하지 않아 `-`). JSON 유효 = 첫 시도 성공 배치 비율(JSON 계열만).',
    '- 숫자/URL/고유명사: 원문 슬롯에 있던 토큰이 출력에 그대로 있는 비율. 고유명사는 휴리스틱(en: 중간 대문자·CamelCase·약어, ja/zh: 라틴 토큰).',
    '- 길이이상: 출력/원문 비공백 길이비가 0.25~3.5 밖. 반복/환각: 동일 10자 구간 3회 이상 반복 또는 출력이 원문 3배+40자 초과.', '');

  // Ratings
  const rs = summarizeRatings(ratings);
  if (rs.length) {
    L.push('## 2. 사용자 블라인드 평가', '', '| 엔진 | 언어 | 평가 수 | 자연스러움 | 정확성 | 최선 선택 |', '|---|---|---|---|---|---|');
    for (const r of rs.sort((a, b) => (a.lang || '').localeCompare(b.lang || '') || (b.naturalness ?? 0) - (a.naturalness ?? 0))) L.push(`| ${r.engine} | ${r.lang ?? '-'} | ${r.rated} | ${num(r.naturalness, 2)} | ${num(r.accuracy, 2)} | ${r.best} |`);
    L.push('');
  } else L.push('## 2. 사용자 블라인드 평가', '', '`results/ratings*.json` 없음 (rate.html 평가 후 저장).', '');

  // Scenarios
  L.push('## 3. 자원 시나리오', '');
  if (scenarios.length) {
    L.push('| 엔진 | 시나리오 | keep_alive | 성공 스텝 | 첫 스텝 ms | 스텝 중앙값 ms | 스텝 p95 ms | 배치 최대 ms |', '|---|---|---|---|---|---|---|---|');
    for (const s of scenarios) {
      const okSteps = s.steps.filter((x) => x.ok);
      const stepMs = okSteps.map((x) => x.result.totalMs);
      const batchMs = okSteps.flatMap((x) => (x.result.batches || []).map((b) => b.ms));
      L.push(`| ${s.engine} | ${s.name} | ${s.keepAliveSec ?? '-'} | ${okSteps.length}/${s.steps.length} | ${ms(stepMs[0])} | ${ms(median(stepMs))} | ${ms(percentile(stepMs, 95))} | ${ms(batchMs.length ? Math.max(...batchMs) : null)} |`);
    }
    L.push('');
  } else L.push('scenario 결과 없음.', '');

  if (monitors.length) {
    L.push('### 모니터 (monitor.sh CSV)', '', '| 엔진 | 시나리오 | 최대 추가 RSS | 상위 프로세스(최대 추가) | 스왑아웃 증가 | 최소 free% | 유휴 +1분 | +3분 | +5분 | 언로드 |', '|---|---|---|---|---|---|---|---|---|---|');
    for (const m of monitors) {
      const a = m.analysis;
      const top = a.peakByName.slice(0, 3).map(([n, kb]) => `${n} ${mb(kb)}`).join(', ') || '-';
      L.push(`| ${m.engine} | ${m.scenario} | ${mb(a.peakTotalKb)} | ${esc(top)} | ${a.swapDeltaPages ?? '-'}p (${num(a.swapDeltaMb, 0)}MB) | ${a.minFreePct ?? '-'} | ${mb(a.idle[60])} | ${mb(a.idle[180])} | ${mb(a.idle[300])} | ${a.unloaded === null ? '-' : a.unloaded ? '예' : '아니오'} |`);
    }
    L.push('');
  } else L.push('모니터 CSV(`monitor__<engine>__<scenario>.csv`) 없음.', '');

  if (power.length) {
    L.push('### 전력 (powermetrics, 사용자 실행)', '', '| 엔진 | 샘플 | CPU avg/max mW | GPU avg/max mW | ANE avg/max mW | GPU active avg% |', '|---|---|---|---|---|---|');
    const f = (s) => (s ? `${s.avgMw.toFixed(0)} / ${s.maxMw.toFixed(0)}` : '-');
    for (const p of power) L.push(`| ${p.engine} | ${p.stats.CPU?.samples ?? '-'} | ${f(p.stats.CPU)} | ${f(p.stats.GPU)} | ${f(p.stats.ANE)} | ${num(p.stats.gpuActivePct?.avg, 1)} |`);
    L.push('');
  } else L.push('전력 로그(`power_<engine>.log`) 없음 — `bench/powermetrics.md` 참고.', '');

  // Hard conditions
  L.push('## 4. 하드 조건 (PLAN 5.5)', '',
    `기준: warm p50 <= ${LIMITS.p50Ms}ms, 슬롯/x 보존 >= ${LIMITS.preserve * 100}%, 추가 메모리 <= ${LIMITS.addedMb / 1024}GB, 스왑 증가 없음, 유휴 시 언로드, 오프라인 동작(로컬 127.0.0.1/온디바이스 — 수동 확인).`, '',
    '| 엔진 | 언어 | p50 | 슬롯/x | 메모리 | 스왑 | 언로드 | 종합 |', '|---|---|---|---|---|---|---|---|');
  for (const t of table) {
    const h = hardConditions(t.engine, t.sp, t.ag, monitors);
    L.push(`| ${t.engine} | ${t.lang} | ${h.p50} | ${h.slot} | ${h.mem} | ${h.swap} | ${h.unload} | ${h.overall} |`);
  }
  L.push('', 'PENDING = 측정 데이터 없는 항목(N/A)이 있음. 메모리·스왑·언로드는 usage-sim(없으면 resident) 모니터 기준.', '');

  // Side by side
  if (sbs) {
    L.push('## 5. 나란히 비교 (사람 읽기용, run 1 기준)', '');
    for (const lang of langs) {
      const corpus = corpora[lang];
      if (!corpus) continue;
      L.push(`### ${lang}`, '');
      const per = engines.map((e) => {
        const rs0 = (groups.get(`${e}\t${lang}`) || []).sort((a, b) => (a.run ?? 1) - (b.run ?? 1))[0];
        return rs0 ? { engine: e, byId: new Map(rs0.blocks.map((b) => [b.id, b])) } : null;
      }).filter(Boolean);
      for (const b of corpus.blocks) {
        L.push(`**${b.id}** (${b.genre ?? ''})`, '', `- 원문: ${esc(b.items.map((it) => (it.k === 'x' ? `[${it.text}]` : it.text)).join(''))}`);
        for (const p of per) {
          const rb = p.byId.get(b.id);
          L.push(`- **${p.engine}**: ${rb ? (rb.slots ? esc(reconstruct(b, rb.slots)) : `(오류: ${esc(rb.error || 'none')})`) : '(결과 없음)'}`);
        }
        L.push('');
      }
    }
  }
  return L.join('\n');
}

export function main(argv) {
  const a = parseArgs(argv);
  const dir = resolve(a.resultsDir || join(BENCH, 'results'));
  const corpusDir = resolve(a.corpusDir || join(BENCH, 'corpus'));
  const groups = loadResults(dir);
  const corpora = {};
  for (const lang of new Set([...groups.keys()].map((k) => k.split('\t')[1]))) {
    const p = join(corpusDir, `${lang}.json`);
    if (existsSync(p)) corpora[lang] = loadCorpus(p);
  }
  const md = buildReport({
    groups, corpora, scenarios: loadScenarios(dir), monitors: loadMonitors(dir), power: loadPower(dir), ratings: loadRatings(dir), sbs: !a.noSbs,
  });
  const out = resolve(a.out || join(BENCH, 'REPORT.md'));
  writeFileSync(out, md + '\n');
  console.log(`wrote ${out}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
