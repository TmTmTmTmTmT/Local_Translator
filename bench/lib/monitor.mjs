// Parsers for monitor.sh CSVs and `powermetrics` text logs, plus ratings aggregation.
const PAGE_KB = 16; // Apple Silicon vm_stat page size

export function parseMonitorCsv(text) {
  const rows = [];
  for (const line of text.split('\n').slice(1)) {
    if (!line.trim()) continue;
    const [epoch, kind, f1, f2, f3, f4] = line.split(',');
    rows.push({ epoch: Number(epoch), kind, f1, f2, f3, f4 });
  }
  return rows;
}

// Added RSS = rss - baseline per pid, summed per process name, summed over names => total added (KB) per epoch.
export function analyzeMonitor(rows) {
  const epochs = [...new Set(rows.map((r) => r.epoch))].sort((a, b) => a - b);
  const perEpoch = new Map(); // epoch -> Map(name -> addedKb)
  for (const r of rows) {
    if (r.kind !== 'proc') continue;
    const added = Math.max(0, Number(r.f2) - Number(r.f4 || 0));
    const m = perEpoch.get(r.epoch) || new Map();
    m.set(r.f3, (m.get(r.f3) || 0) + added);
    perEpoch.set(r.epoch, m);
  }
  const totalAt = new Map();
  const peakByName = new Map();
  for (const e of epochs) {
    const m = perEpoch.get(e) || new Map();
    let tot = 0;
    for (const [n, kb] of m) { tot += kb; if (kb > (peakByName.get(n) || 0)) peakByName.set(n, kb); }
    totalAt.set(e, tot);
  }
  const peakTotalKb = Math.max(0, ...totalAt.values());
  const sys = rows.filter((r) => r.kind === 'sys');
  const swaps = sys.map((r) => Number(r.f1)).filter(Number.isFinite);
  const frees = sys.map((r) => Number(r.f2)).filter(Number.isFinite);
  const marks = rows.filter((r) => r.kind === 'mark').map((r) => ({ epoch: r.epoch, label: r.f1 }));
  const endMark = [...marks].reverse().find((m) => m.label === 'end') || [...marks].reverse().find((m) => m.label !== 'stop');
  const lastEpoch = epochs[epochs.length - 1];
  const idle = {};
  if (endMark) {
    for (const off of [60, 180, 300]) {
      const t = endMark.epoch + off;
      if (t > lastEpoch + 1) { idle[off] = null; continue; }
      let best = null;
      for (const e of epochs) if (e <= t) best = e; else break;
      idle[off] = best === null ? null : totalAt.get(best);
    }
  }
  const lastIdle = [300, 180, 60].map((o) => idle[o]).find((v) => v !== null && v !== undefined);
  const idleKnown = endMark ? [300, 180, 60].find((o) => idle[o] !== null && idle[o] !== undefined) : undefined;
  // Unloaded = by the latest idle sample, added memory fell below max(100MB, 20% of peak).
  const unloaded = idleKnown !== undefined && idleKnown >= 180 ? lastIdle <= Math.max(100 * 1024, 0.2 * peakTotalKb) : null;
  return {
    durationSec: epochs.length ? lastEpoch - epochs[0] : 0,
    peakTotalKb,
    peakByName: [...peakByName].sort((a, b) => b[1] - a[1]),
    swapDeltaPages: swaps.length ? swaps[swaps.length - 1] - swaps[0] : null,
    swapDeltaMb: swaps.length ? ((swaps[swaps.length - 1] - swaps[0]) * PAGE_KB) / 1024 : null,
    minFreePct: frees.length ? Math.min(...frees) : null,
    marks, idle, unloaded,
  };
}

// powermetrics text: "CPU Power: 1182 mW", "GPU Power: 20 mW", "ANE Power: 0 mW", "Combined Power (CPU + GPU + ANE): ..".
export function parsePowermetrics(text) {
  const acc = {};
  const gpuRes = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    let m = line.match(/^(CPU|GPU|ANE|DRAM|Combined Power[^:]*)\s*(?:Power)?:\s*([\d.]+)\s*(mW|W)\b/i);
    if (m) {
      const key = m[1].toLowerCase().startsWith('combined') ? 'combined' : m[1].toUpperCase();
      const mw = Number(m[2]) * (m[3].toLowerCase() === 'w' ? 1000 : 1);
      (acc[key] ||= []).push(mw);
      continue;
    }
    m = line.match(/^GPU HW active residency:\s*([\d.]+)%/i);
    if (m) gpuRes.push(Number(m[1]));
  }
  const stat = (a) => ({ samples: a.length, avgMw: a.reduce((s, x) => s + x, 0) / a.length, maxMw: Math.max(...a) });
  const out = {};
  for (const [k, a] of Object.entries(acc)) out[k] = stat(a);
  if (gpuRes.length) out.gpuActivePct = { samples: gpuRes.length, avg: gpuRes.reduce((s, x) => s + x, 0) / gpuRes.length, max: Math.max(...gpuRes) };
  return out;
}

// Flatten rate.js output ({ratings:[{blockId,candidates:[{engine,naturalness,accuracy,best}]}]}) or flat arrays.
export function flattenRatings(data, lang) {
  const list = Array.isArray(data) ? data : data?.ratings ?? [];
  const lg = data?.lang ?? lang;
  const out = [];
  for (const r of list) {
    if (Array.isArray(r.candidates)) for (const c of r.candidates) out.push({ lang: lg, blockId: r.blockId, ...c });
    else out.push({ lang: r.lang ?? lg, blockId: r.blockId ?? r.id, ...r });
  }
  return out;
}

export function summarizeRatings(flat) {
  const by = new Map();
  for (const r of flat) {
    if (!r.engine) continue;
    const k = `${r.engine}|${r.lang ?? ''}`;
    const e = by.get(k) || { engine: r.engine, lang: r.lang, n: [], a: [], best: 0, count: 0 };
    if (r.naturalness) e.n.push(r.naturalness);
    if (r.accuracy) e.a.push(r.accuracy);
    if (r.best) e.best++;
    e.count++;
    by.set(k, e);
  }
  const avg = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null);
  return [...by.values()].map((e) => ({ engine: e.engine, lang: e.lang, rated: e.n.length, naturalness: avg(e.n), accuracy: avg(e.a), best: e.best }));
}
