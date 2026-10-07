// PDF.js textContent.items -> 줄 -> 다단 -> 문단 -> 번역 블록 항목(t/x). 순수 함수 (DOM·PDF.js 비의존).
// 입력 page: {page, width, height, viewTransform?, items, links?, fonts?}. 좌표 가정은 PDF.js 기본
// (items.transform·links는 PDF 사용자 공간, viewTransform 생략 시 y 뒤집기). 출력 bbox는 viewTransform 공간(scale 1 기준 좌상단 원점).
(function () {
  'use strict';

  const LINK_COVER = 0.9; // 항목의 이 비율 이상이 링크 rect 안이면 항목 전체를 x로
  const GAP_EM = 1.6; // 같은 줄에서 이 이상 벌어지면 조각(fragment)으로 분리 (다단 후보)
  const SPACE_EM = 0.15; // 같은 줄 항목 사이 공백 삽입 임계
  const BASELINE_TOL = 0.45; // 윗첨자·아랫첨자가 같은 줄에 남도록 여유
  const PARA_GAP = 1.6; // 줄 간격이 글자 크기의 이 배 초과면 문단 분리
  const INDENT_EM = 0.8;
  const MARGIN_ZONE = 0.12; // 반복 머리글/바닥글·쪽번호 후보 영역(위·아래 비율)
  const MONO_RE = /mono|courier|code|consolas/i;
  const CJK_RE = /[⺀-鿿㐀-䶿豈-﫿＀-￯　-〿]/;
  const ZW_RE = /[​-‍⁠﻿]/g;
  const PAGENUM_RE = /^(?:page\s*)?[-–—]?\s*(?:\d{1,4}|[ivxlc]{1,6})\s*[-–—]?(?:\s*(?:\/|of)\s*\d{1,4})?$/i;
  const BULLET_RE = /^(?:[•◦▪●■·*\-–—]|\(?\d{1,3}[.)]|\(?[a-z][.)])\s/;

  function mul(a, b) {
    return [
      a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
      a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
      a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5],
    ];
  }

  function isNonlinguistic(text) {
    const t = String(text == null ? '' : text).replace(ZW_RE, '').trim();
    if (!t) return true;
    if (!/[\p{L}\p{M}]/u.test(t)) return true;
    if (/^(?:https?:\/\/|www\.)\S+$/i.test(t) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return true;
    return false;
  }

  const lastCh = (s) => { const a = Array.from(s); return a.length ? a[a.length - 1] : ''; };
  const firstCh = (s) => { const a = Array.from(s); return a.length ? a[0] : ''; };

  function rectToView(r, vt) {
    const pts = [[r[0], r[1]], [r[2], r[1]], [r[0], r[3]], [r[2], r[3]]].map(([x, y]) => [
      vt[0] * x + vt[2] * y + vt[4], vt[1] * x + vt[3] * y + vt[5],
    ]);
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  }

  // 링크 rect와 겹치는 구간만 x 조각으로 분리 (문자 위치는 폭 비례 근사).
  function splitByLink(part, rect) {
    const top = part.y - part.size;
    const bottom = part.y + part.size * 0.2;
    const vo = Math.min(bottom, rect[3]) - Math.max(top, rect[1]);
    if (vo < 0.5 * (bottom - top)) return [part];
    const a = Math.max(part.x, rect[0]);
    const b = Math.min(part.x + part.w, rect[2]);
    if (b <= a) return [part];
    if (b - a >= LINK_COVER * part.w) return [Object.assign({}, part, { link: true })];
    if (b - a < 0.1 * part.w) return [part];
    const len = part.str.length;
    const i0 = Math.max(0, Math.min(len, Math.round(((a - part.x) / part.w) * len)));
    const i1 = Math.max(i0, Math.min(len, Math.round(((b - part.x) / part.w) * len)));
    const mk = (s, i, j, link) => {
      if (j <= i) return null;
      return Object.assign({}, part, {
        str: s.slice(i, j), x: part.x + (part.w * i) / len, w: (part.w * (j - i)) / len, link: link || part.link,
      });
    };
    return [mk(part.str, 0, i0, false), mk(part.str, i0, i1, true), mk(part.str, i1, len, false)].filter(Boolean);
  }

  function prepare(page) {
    const H = page.height || 0;
    const vt = page.viewTransform || [1, 0, 0, -1, 0, H];
    const s = Math.hypot(vt[0], vt[1]) || 1;
    const fonts = page.fonts || {};
    const links = (page.links || []).filter((r) => Array.isArray(r) && r.length >= 4).map((r) => rectToView(r, vt));
    let total = 0;
    let vertical = 0;
    let parts = [];
    for (const it of page.items || []) {
      if (!it || typeof it.str !== 'string' || it.str === '') continue;
      const style = fonts[it.fontName];
      const family = typeof style === 'string' ? style : (style && (style.fontFamily || style.name)) || '';
      const chars = it.str.replace(/\s/g, '').length;
      const isVertical = !!(it.vertical || (style && style.vertical));
      total += chars;
      if (isVertical) { vertical += chars; continue; }
      const m = mul(vt, it.transform || [1, 0, 0, 1, 0, 0]);
      if (Math.abs(m[1]) > Math.abs(m[0])) continue; // 회전된 텍스트(옆면 스탬프 등)는 줄 구성에서 제외
      const size = Math.hypot(m[2], m[3]) || (it.height || 0) * s || 10;
      let w = (it.width || 0) * s;
      if (!w) w = it.str.length * size * 0.5;
      parts.push({
        str: it.str, x: m[4], y: m[5], w, size,
        mono: MONO_RE.test(String(it.fontName || '')) || MONO_RE.test(family),
        link: false,
      });
    }
    for (const r of links) {
      parts = parts.flatMap((p) => (p.link ? [p] : splitByLink(p, r)));
    }
    return { parts, total, vertical, H, vt };
  }

  function groupLines(items) {
    const sorted = items.slice().sort((a, b) => a.y - b.y || a.x - b.x);
    const lines = [];
    for (const it of sorted) {
      let line = null;
      for (let k = lines.length - 1; k >= 0 && k >= lines.length - 3; k--) {
        const l = lines[k];
        if (Math.abs(it.y - l.y) <= BASELINE_TOL * Math.max(it.size, l.size)) { line = l; break; }
      }
      if (!line) { line = { y: it.y, size: it.size, items: [] }; lines.push(line); }
      else if (it.size > line.size) { line.y = it.y; line.size = it.size; }
      line.items.push(it);
    }
    for (const l of lines) finishLine(l);
    return lines;
  }

  function finishLine(l) {
    l.items.sort((a, b) => a.x - b.x);
    l.x0 = Math.min(...l.items.map((i) => i.x));
    l.x1 = Math.max(...l.items.map((i) => i.x + i.w));
    l.text = l.items.map((i) => i.str).join('').replace(/\s+/g, ' ').trim();
  }

  function plainLineText(items) {
    let out = '';
    let prev = null;
    for (const it of items) {
      if (prev && it.x - (prev.x + prev.w) > SPACE_EM * it.size && !/\s$/.test(out) && !/^\s/.test(it.str)) out += ' ';
      out += it.str;
      prev = it;
    }
    return out.replace(/\s+/g, ' ').trim();
  }

  const normKey = (t) => t.toLowerCase().replace(/\d+/g, '0').replace(/\s+/g, ' ').trim();
  const inMargin = (y, H) => H > 0 && (y < H * MARGIN_ZONE || y > H * (1 - MARGIN_ZONE));

  // 페이지별 줄 요약 (반복 머리글 탐지 입력).
  function pageLines(page) {
    const p = prepare(page);
    const lines = groupLines(p.parts);
    return { height: p.H, lines: lines.map((l) => ({ text: plainLineText(l.items), y: l.y })) };
  }

  // 같은 텍스트(숫자 무시)가 같은 y에 ≥3쪽 또는 ≥50%(최소 2쪽) 반복되는 여백 영역 줄.
  function findRepeated(infos) {
    const total = infos.length;
    const byKey = new Map();
    infos.forEach((info, pi) => {
      for (const l of info.lines) {
        if (!l.text || !inMargin(l.y, info.height)) continue;
        const k = normKey(l.text);
        if (!byKey.has(k)) byKey.set(k, []);
        byKey.get(k).push({ page: pi, y: l.y });
      }
    });
    const rep = [];
    for (const [key, occ] of byKey) {
      occ.sort((a, b) => a.y - b.y);
      let best = null;
      for (const o of occ) {
        const pages = new Set(occ.filter((q) => Math.abs(q.y - o.y) <= 3).map((q) => q.page));
        if (!best || pages.size > best.n) best = { n: pages.size, y: o.y };
      }
      if (best && (best.n >= 3 || (best.n >= 2 && best.n >= 0.5 * total))) rep.push({ key, y: best.y });
    }
    return rep;
  }

  function dropLine(line, H, repeated) {
    if (!inMargin(line.y, H)) return false;
    const text = plainLineText(line.items);
    if (PAGENUM_RE.test(text)) return true;
    const k = normKey(text);
    return (repeated || []).some((r) => r.key === k && Math.abs(r.y - line.y) <= 3);
  }

  // 좌우 조각 -> 열. 좁은 조각의 x 커버리지가 거의 0인 구간(여백 골)으로 구분.
  function detectColumns(frags, medSize) {
    if (frags.length < 6) return null;
    const minX = Math.min(...frags.map((f) => f.x0));
    const maxX = Math.max(...frags.map((f) => f.x1));
    const cw = maxX - minX;
    if (cw <= 0) return null;
    const narrow = frags.filter((f) => f.x1 - f.x0 <= 0.65 * cw);
    if (narrow.length < 6) return null;
    const minGutter = Math.max(8, 1.2 * medSize);
    const tol = Math.floor(0.05 * narrow.length);
    const ev = [];
    for (const f of narrow) { ev.push([f.x0, 1]); ev.push([f.x1, -1]); }
    ev.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const gutters = [];
    let cov = 0;
    let segStart = null;
    for (let i = 0; i < ev.length; i++) {
      cov += ev[i][1];
      const x = ev[i][0];
      const nextX = i + 1 < ev.length ? ev[i + 1][0] : x;
      if (cov <= tol && nextX - x >= minGutter && x > minX && nextX < maxX) {
        // 직전 gutter와 이어지는 구간이면 병합
        if (segStart === null) segStart = x;
        gutters.push([segStart, nextX]);
        segStart = null;
      }
    }
    if (!gutters.length) return null;
    const cuts = gutters.map((g) => (g[0] + g[1]) / 2);
    const colOf = (f) => { const c = (f.x0 + f.x1) / 2; let n = 0; while (n < cuts.length && c > cuts[n]) n++; return n; };
    const counts = new Array(cuts.length + 1).fill(0);
    for (const f of narrow) counts[colOf(f)]++;
    if (counts.some((n) => n < 3)) return null;
    return { colOf, wideLimit: 0.65 * cw };
  }

  function mergeFragsToLines(frags) {
    // 같은 열·같은 기준선 조각을 한 줄로 합침.
    const sorted = frags.slice().sort((a, b) => a.y - b.y || a.x0 - b.x0);
    const lines = [];
    for (const f of sorted) {
      let line = null;
      for (let k = lines.length - 1; k >= 0 && k >= lines.length - 3; k--) {
        if (Math.abs(f.y - lines[k].y) <= BASELINE_TOL * Math.max(f.size, lines[k].size)) { line = lines[k]; break; }
      }
      if (!line) { line = { y: f.y, size: f.size, items: [] }; lines.push(line); }
      else if (f.size > line.size) { line.y = f.y; line.size = f.size; }
      line.items.push(...f.items);
    }
    for (const l of lines) finishLine(l);
    return lines.sort((a, b) => a.y - b.y);
  }

  function orderStreams(lines, medSize) {
    const frags = [];
    for (const l of lines) {
      let cur = [l.items[0]];
      for (let i = 1; i < l.items.length; i++) {
        const prev = l.items[i - 1];
        if (l.items[i].x - (prev.x + prev.w) > GAP_EM * Math.max(l.size, medSize * 0.8)) { frags.push(mk(cur, l)); cur = []; }
        cur.push(l.items[i]);
      }
      frags.push(mk(cur, l));
    }
    function mk(items, l) {
      return { items, y: l.y, size: l.size, x0: Math.min(...items.map((i) => i.x)), x1: Math.max(...items.map((i) => i.x + i.w)) };
    }
    const cols = detectColumns(frags, medSize);
    if (!cols) return [lines.slice().sort((a, b) => a.y - b.y)];
    // 폭이 넓은 조각(제목 등)이 띠를 나누고, 띠 안에서는 열 단위로 위->아래.
    const sorted = frags.slice().sort((a, b) => a.y - b.y || a.x0 - b.x0);
    const blocks = [];
    for (const f of sorted) {
      const wide = f.x1 - f.x0 > cols.wideLimit;
      const last = blocks[blocks.length - 1];
      if (last && last.wide === wide) last.frags.push(f);
      else blocks.push({ wide, frags: [f] });
    }
    const streams = [];
    for (const b of blocks) {
      if (b.wide) { streams.push(mergeFragsToLines(b.frags)); continue; }
      const byCol = new Map();
      for (const f of b.frags) {
        const c = cols.colOf(f);
        if (!byCol.has(c)) byCol.set(c, []);
        byCol.get(c).push(f);
      }
      for (const c of Array.from(byCol.keys()).sort((a, b) => a - b)) streams.push(mergeFragsToLines(byCol.get(c)));
    }
    return streams;
  }

  function splitParagraphs(stream) {
    if (!stream.length) return [];
    const left = Math.min(...stream.map((l) => l.x0));
    const paras = [[stream[0]]];
    for (let i = 1; i < stream.length; i++) {
      const prev = stream[i - 1];
      const line = stream[i];
      const maxSize = Math.max(line.size, prev.size);
      const gap = line.y - prev.y;
      let brk = false;
      if (gap > PARA_GAP * maxSize) brk = true;
      else if (Math.abs(line.size - prev.size) > 0.15 * prev.size) brk = true;
      else if (line.x0 - left > INDENT_EM * line.size && prev.x0 - left <= 0.3 * line.size && !BULLET_RE.test(prev.text)) brk = true;
      else if (BULLET_RE.test(line.text)) brk = true;
      if (brk) paras.push([line]); else paras[paras.length - 1].push(line);
    }
    return paras;
  }

  // 줄 목록 -> t/x 항목. 하이픈 연결·CJK 무공백 결합을 여기서 처리.
  function buildItems(lines) {
    const runs = [];
    function push(text, isX, sep) {
      const prev = runs[runs.length - 1];
      if (prev && sep !== 'none') {
        const a = prev.text;
        const b = text;
        if (sep === 'line' && !prev.x && !isX && /­$/.test(a)) {
          prev.text = a.slice(0, -1); sep = 'none';
        } else if (sep === 'line' && !prev.x && !isX && /\p{L}-$/u.test(a) && /^\p{Ll}/u.test(b)) {
          prev.text = a.slice(0, -1); sep = 'none';
        } else if (/[-‐]$/.test(a) && /\p{L}[-‐]$/u.test(a) && /^\p{L}/u.test(b) && sep === 'line') {
          sep = 'none'; // 대문자 등으로 이어지는 하이픈은 유지하고 공백만 생략
        } else if (/\s$/.test(a) || /^\s/.test(b) || CJK_RE.test(lastCh(a)) || CJK_RE.test(firstCh(b))) {
          sep = 'none';
        }
        if (sep !== 'none') {
          if (prev.x && !isX) text = ' ' + text; else prev.text += ' ';
        }
      }
      if (prev && prev.x === isX) prev.text += text;
      else runs.push({ text, x: isX });
    }
    lines.forEach((line) => {
      line.items.forEach((it, idx) => {
        let sep;
        if (idx === 0) sep = 'line';
        else {
          const p = line.items[idx - 1];
          sep = it.x - (p.x + p.w) > SPACE_EM * it.size ? 'space' : 'none';
        }
        push(it.str, !!(it.link || it.mono), runs.length ? sep : 'none');
      });
    });
    // 비언어 t -> x, 인접 x 병합
    const items = [];
    for (const r of runs) {
      const x = r.x || isNonlinguistic(r.text);
      const last = items[items.length - 1];
      if (last && last.x === x) last.text += r.text;
      else items.push({ x, text: r.text });
    }
    if (items.length) {
      items[0].text = items[0].text.replace(/^\s+/, '');
      items[items.length - 1].text = items[items.length - 1].text.replace(/\s+$/, '');
    }
    const out = [];
    let n = 0;
    for (const r of items) {
      if (!r.text) continue;
      out.push(r.x ? { k: 'x', text: r.text } : { k: 't', i: n++, text: r.text });
    }
    return out;
  }

  function bboxOf(lines) {
    let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
    for (const l of lines) {
      x0 = Math.min(x0, l.x0); x1 = Math.max(x1, l.x1);
      y0 = Math.min(y0, l.y - l.size); y1 = Math.max(y1, l.y + l.size * 0.2);
    }
    return [x0, y0, x1 - x0, y1 - y0];
  }

  // 한 쪽 -> 문단 배열 | {unsupported}
  function segmentPage(page, opts) {
    const o = opts || {};
    const p = prepare(page);
    const hasText = p.parts.some((q) => /\S/.test(q.str));
    if (p.total > 0 && p.vertical / p.total > 0.5) return { unsupported: 'vertical' };
    if (!hasText) return { unsupported: 'no-text' };
    let lines = groupLines(p.parts).filter((l) => /\S/.test(l.text) && !dropLine(l, p.H, o.repeated));
    if (!lines.length) return [];
    const sizes = lines.map((l) => l.size).sort((a, b) => a - b);
    const med = sizes[Math.floor(sizes.length / 2)] || 10;
    const num = page.page != null ? page.page : 1;
    const out = [];
    for (const stream of orderStreams(lines, med)) {
      for (const para of splitParagraphs(stream)) {
        const items = buildItems(para);
        if (!items.length) continue;
        out.push({
          id: 'p' + num + '-' + out.length,
          text: items.map((i) => i.text).join(''),
          bbox: bboxOf(para),
          items,
        });
      }
    }
    return out;
  }

  // 문서 전체 편의 함수. 전부 텍스트 없음 -> no-text, 세로쓰기 우세 -> vertical.
  function segmentDocument(pages) {
    const repeated = findRepeated(pages.map(pageLines));
    const res = pages.map((pg) => segmentPage(pg, { repeated }));
    if (res.some((r) => r && r.unsupported === 'vertical')) return { unsupported: 'vertical' };
    if (res.every((r) => r && r.unsupported === 'no-text')) return { unsupported: 'no-text' };
    return { pages: res.map((r) => (Array.isArray(r) ? r : [])) };
  }

  const api = { segmentPage, segmentDocument, pageLines, findRepeated, isNonlinguistic };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.pdfseg = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
