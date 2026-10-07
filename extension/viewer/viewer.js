// 확장 PDF 뷰어: PDF.js로 렌더(좌) + pdfseg 문단을 번역해 표시(우). 텍스트는 textContent로만 삽입.
import * as pdfjsLib from '../vendor/pdfjs/build/pdf.min.mjs';

const KT = globalThis.KT || {};
const MAX_BYTES = 200 * 1024 * 1024;
const BATCH_CHARS = 6000;
const BATCH_BLOCKS = 40;
const SAMPLE_PAGES = 20; // 반복 머리글·언어·텍스트 유무 판정용 표본
const FATAL = new Set(['needs_language_pack', 'engine_unavailable']);
const CODE_MSG = {
  needs_language_pack: '언어팩이 설치되지 않았습니다. 컨테이너 앱에서 해당 언어팩을 설치하세요.',
  engine_unavailable: '번역 엔진을 사용할 수 없습니다. 옵션에서 엔진을 확인하세요.',
  unsupported_lang: '지원하지 않는 언어입니다.',
  rate_limited: '요청이 너무 많습니다. 잠시 후 다시 시도됩니다.',
  timeout: '번역 시간이 초과되었습니다.',
  bad_response: '번역 응답을 해석하지 못했습니다.',
};

const $ = (id) => document.getElementById(id);
const api = globalThis.browser || globalThis.chrome;

const params = new URLSearchParams(location.search);
const src = params.get('src') || '';
let srcUrl = null;
try { srcUrl = new URL(src); } catch (e) { /* 아래에서 처리 */ }

function originalHref() {
  if (!srcUrl) return '#';
  const u = new URL(srcUrl.href);
  u.hash = 'kt-original'; // 자동 전환 재진입 방지 표식
  return u.href;
}

function showMessage(text, withOriginal) {
  const box = $('message');
  box.textContent = text;
  if (withOriginal && srcUrl) {
    box.append(' ');
    const a = document.createElement('a');
    a.href = originalHref();
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = '원본 열기';
    box.append(a);
  }
  box.hidden = false;
}

function setStatus(text, state) {
  const el = $('status');
  el.textContent = text;
  el.dataset.state = state || '';
}

const { makeBlocks, mergeResult } = KT.pdfseg;

// ---- 문서 상태 ----
const state = { pdf: null, lang: 'en', title: '', host: '', repeated: [], pages: [], reflow: false, fatal: false, doc: null, noText: false };
const queue = [];
let queueRunning = false;
let translatedParas = 0;
let totalParas = 0;

function guessTitle(meta) {
  const t = meta && meta.info && meta.info.Title;
  if (t && String(t).trim()) return String(t).trim();
  if (srcUrl) { try { return decodeURIComponent(srcUrl.pathname.split('/').filter(Boolean).pop() || srcUrl.host); } catch (e) { return srcUrl.host; } }
  return 'PDF';
}

async function download() {
  const res = await fetch(src, { credentials: 'include' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const total = Number(res.headers.get('content-length')) || 0;
  if (total > MAX_BYTES) throw new Error('파일이 너무 큽니다 (' + Math.round(total / 1048576) + 'MB)');
  if (!res.body || !res.body.getReader) return new Uint8Array(await res.arrayBuffer());
  const reader = res.body.getReader();
  const chunks = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    got += value.length;
    if (got > MAX_BYTES) throw new Error('파일이 너무 큽니다');
    setStatus('다운로드 ' + (total ? Math.round((got / total) * 100) + '%' : Math.round(got / 1048576) + 'MB'));
  }
  const out = new Uint8Array(got);
  let off = 0;
  for (const c of chunks) { out.set(c, off); off += c.length; }
  return out;
}

// 쪽 데이터(텍스트·링크) 캐시. 표본 분석과 지연 처리가 같은 getTextContent를 재사용.
async function loadPageData(n) {
  const rec = state.pages[n - 1];
  if (rec.data) return rec.data;
  if (!rec.dataP) {
    rec.dataP = (async () => {
      const page = await state.pdf.getPage(n);
      const vp = page.getViewport({ scale: 1 });
      const [tc, annots] = await Promise.all([page.getTextContent(), page.getAnnotations().catch(() => [])]);
      const links = annots.filter((a) => a.subtype === 'Link' && a.rect).map((a) => a.rect);
      rec.data = {
        page, vp, annots,
        seg: { page: n, width: vp.width, height: vp.height, viewTransform: vp.transform, items: tc.items.filter((i) => typeof i.str === 'string'), links, fonts: tc.styles || {} },
      };
      return rec.data;
    })();
  }
  return rec.dataP;
}

async function analyzeSample() {
  const N = state.pdf.numPages;
  const idx = [];
  const count = Math.min(N, SAMPLE_PAGES);
  for (let k = 0; k < count; k++) idx.push(Math.floor((k * N) / count) + 1);
  const infos = [];
  let text = '';
  let anyText = false;
  for (const n of idx) {
    const d = await loadPageData(n);
    infos.push(KT.pdfseg.pageLines(d.seg));
    const t = d.seg.items.map((i) => i.str).join(' ');
    if (t.trim()) anyText = true;
    if (text.length < 4000) text += ' ' + t;
  }
  state.repeated = KT.pdfseg.findRepeated(infos);
  state.noText = !anyText;
  const det = KT.lib && KT.lib.lang ? KT.lib.lang.detectLang(text.slice(0, 4000)) : null;
  state.lang = det || 'en';
  $('lang').textContent = state.lang === 'ko' ? '한국어' : state.lang;
}

// ---- 렌더 ----
function buildPageShell(n) {
  const sec = document.createElement('section');
  sec.className = 'page';
  sec.dataset.page = String(n);
  const orig = document.createElement('div');
  orig.className = 'col-orig';
  const tr = document.createElement('div');
  tr.className = 'col-tr';
  const pno = document.createElement('div');
  pno.className = 'pno';
  pno.textContent = n + ' / ' + state.pdf.numPages;
  const body = document.createElement('div');
  body.className = 'paras';
  tr.append(pno, body);
  const hl = document.createElement('div');
  hl.className = 'hl';
  orig.append(hl);
  sec.append(orig, tr);
  return { sec, orig, tr, body, hl };
}

async function renderOriginal(n) {
  const rec = state.pages[n - 1];
  if (rec.rendered || state.reflow) return;
  rec.rendered = true;
  const d = await loadPageData(n);
  const cssW = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--page-w')) || 560;
  const scale = cssW / d.vp.width;
  rec.scale = scale;
  const vp = d.page.getViewport({ scale });
  const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(vp.width * dpr);
  canvas.height = Math.floor(vp.height * dpr);
  canvas.style.width = vp.width + 'px';
  canvas.style.height = vp.height + 'px';
  rec.shell.orig.style.width = vp.width + 'px';
  rec.shell.orig.style.height = vp.height + 'px';
  rec.shell.orig.prepend(canvas);
  try {
    await d.page.render({ canvasContext: canvas.getContext('2d'), viewport: vp, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null }).promise;
  } catch (e) { rec.rendered = false; canvas.remove(); return; }
  addLinks(n, d, vp);
}

// pdf.js 6.x에는 PageViewport.convertToViewportRectangle이 없어 변환 행렬로 직접 계산한다.
function toViewportRect(m, r) {
  const px = (x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  const [ax, ay] = px(r[0], r[1]);
  const [bx, by] = px(r[2], r[3]);
  return [ax, ay, bx, by];
}

// PDF.js 주석 레이어 대신 Link 주석만 직접 오버레이 (스크립트 없는 CSP-safe 앵커).
function addLinks(n, d, vp) {
  const rec = state.pages[n - 1];
  for (const a of d.annots) {
    if (a.subtype !== 'Link' || !a.rect) continue;
    const [x1, y1, x2, y2] = toViewportRect(vp.transform, a.rect);
    const el = document.createElement('a');
    el.className = 'link';
    el.style.left = Math.min(x1, x2) + 'px';
    el.style.top = Math.min(y1, y2) + 'px';
    el.style.width = Math.abs(x2 - x1) + 'px';
    el.style.height = Math.abs(y2 - y1) + 'px';
    const url = a.url || a.unsafeUrl;
    if (url && /^(https?:|mailto:)/i.test(url)) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    } else if (a.dest) {
      el.href = '#';
      el.addEventListener('click', (ev) => { ev.preventDefault(); goToDest(a.dest); });
    } else continue;
    rec.shell.orig.append(el);
  }
}

async function goToDest(dest) {
  try {
    const d = typeof dest === 'string' ? await state.pdf.getDestination(dest) : dest;
    if (!Array.isArray(d)) return;
    const idx = typeof d[0] === 'object' ? await state.pdf.getPageIndex(d[0]) : d[0];
    const rec = state.pages[idx];
    if (rec) rec.shell.sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) { /* 잘못된 목적지는 무시 */ }
}

function paragraphEl(p, rec) {
  const el = document.createElement('p');
  el.className = 'kt-p';
  el.dataset.id = p.id;
  el.textContent = p.text;
  el.title = p.text;
  el.dataset.state = 'pending';
  el.addEventListener('mouseenter', () => highlight(rec, p.bbox));
  el.addEventListener('mouseleave', () => { rec.shell.hl.style.display = 'none'; });
  return el;
}

function highlight(rec, bbox) {
  if (!rec.rendered || state.reflow) return;
  const s = rec.scale || 1;
  const hl = rec.shell.hl;
  hl.style.left = bbox[0] * s + 'px';
  hl.style.top = bbox[1] * s + 'px';
  hl.style.width = bbox[2] * s + 'px';
  hl.style.height = bbox[3] * s + 'px';
  hl.style.display = 'block';
}

function hasHangulMajority(text) {
  return KT.lib && KT.lib.lang && KT.lib.lang.detectLang(text) === 'ko';
}

async function prepareTranslation(n) {
  const rec = state.pages[n - 1];
  if (rec.prepared) return;
  rec.prepared = true;
  const d = await loadPageData(n);
  const seg = KT.pdfseg.segmentPage(d.seg, { repeated: state.repeated });
  if (!Array.isArray(seg)) {
    const msg = document.createElement('div');
    msg.className = 'note';
    msg.textContent = seg.unsupported === 'vertical' ? '세로쓰기 PDF는 지원하지 않습니다.' : '텍스트가 없는 쪽입니다 (OCR 미지원).';
    rec.shell.body.append(msg);
    return;
  }
  rec.paras = seg;
  const jobs = [];
  for (const p of seg) {
    const el = paragraphEl(p, rec);
    rec.shell.body.append(el);
    const hasT = p.items.some((i) => i.k === 't');
    if (!hasT || state.lang === 'ko' || hasHangulMajority(p.text)) { el.dataset.state = 'skip'; continue; }
    jobs.push({ p, el });
  }
  totalParas += jobs.length;
  // 문서 순서 연속 문단 묶음 (≤6000자 / 40블록)
  let batch = [];
  let chars = 0;
  let nBlocks = 0;
  const flush = () => { if (batch.length) queue.push(batch); batch = []; chars = 0; nBlocks = 0; };
  for (const j of jobs) {
    const blocks = makeBlocks(j.p, state.lang);
    const len = blocks.reduce((s, b) => s + b.items.reduce((q, i) => q + i.text.length, 0), 0);
    if (batch.length && (chars + len > BATCH_CHARS || nBlocks + blocks.length > BATCH_BLOCKS)) flush();
    batch.push({ ...j, blocks });
    chars += len;
    nBlocks += blocks.length;
  }
  flush();
  updateProgress();
  runQueue();
}

function updateProgress() {
  if (state.fatal) return;
  const left = totalParas - translatedParas;
  setStatus(left > 0 ? '번역 중… ' + translatedParas + '/' + totalParas + ' 문단' : '번역 완료 · ' + translatedParas + ' 문단', '');
}

async function runQueue() {
  if (queueRunning) return;
  queueRunning = true;
  while (queue.length && !state.fatal) {
    const batch = queue.shift();
    const blocks = batch.flatMap((j) => j.blocks);
    let res;
    try {
      res = await api.runtime.sendMessage({
        type: 'translate',
        blocks: blocks.map((b) => ({ id: b.id, lang: b.lang, items: b.items })),
        context: { title: state.title, host: srcUrl ? srcUrl.host : '' },
        lang: state.lang,
      });
    } catch (e) { res = { ok: false, code: 'unknown', message: String(e && e.message || e) }; }
    if (!res || !res.ok) {
      const code = (res && res.code) || 'unknown';
      for (const j of batch) j.el.dataset.state = 'error';
      translatedParas += batch.length;
      if (FATAL.has(code)) {
        state.fatal = true;
        setStatus(CODE_MSG[code] || '번역 실패', 'error');
        showMessage(CODE_MSG[code] || '번역 실패: ' + code, false);
      } else {
        setStatus(CODE_MSG[code] || '일부 번역 실패 (' + code + ')', 'error');
      }
      continue;
    }
    const byId = new Map((res.results || []).map((r) => [r.id, r]));
    for (const j of batch) {
      const { text, hit } = mergeResult(j.p, j.blocks, byId);
      if (hit > 0) { j.el.textContent = text; j.el.dataset.state = 'done'; } else j.el.dataset.state = 'error';
      translatedParas++;
    }
    if (res.engine) $('lang').title = '엔진: ' + res.engine;
    updateProgress();
  }
  queueRunning = false;
}

function activate(n) {
  if (n < 1 || n > state.pdf.numPages) return;
  const rec = state.pages[n - 1];
  renderOriginal(n).catch((e) => console.error("[kt viewer] render", n, e));
  if (!state.noText) prepareTranslation(n).catch((e) => console.error("[kt viewer] translate", n, e));
  else if (!rec.noTextShown) {
    rec.noTextShown = true;
    const msg = document.createElement('div');
    msg.className = 'note';
    msg.textContent = '텍스트가 없는 스캔 PDF입니다 (OCR 미지원).';
    rec.shell.body.append(msg);
  }
}

function setupObserver() {
  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const n = Number(e.target.dataset.page);
      if (e.isIntersecting) visible.add(n); else visible.delete(n);
    }
    for (const n of visible) { activate(n - 1); activate(n); activate(n + 1); }
  }, { rootMargin: '30% 0px 30% 0px' });
  for (const rec of state.pages) io.observe(rec.shell.sec);
  state.rescan = () => { for (const n of visible) { activate(n - 1); activate(n); activate(n + 1); } };
}

async function main() {
  $('original').href = originalHref();
  $('toggle').addEventListener('click', () => {
    state.reflow = !state.reflow;
    document.body.classList.toggle('reflow', state.reflow);
    $('toggle').textContent = state.reflow ? '나란히 보기' : '번역만 보기';
    if (!state.reflow && state.rescan) state.rescan();
  });
  if (!srcUrl || !/^(https?|file):$/.test(srcUrl.protocol)) { showMessage('PDF 주소가 올바르지 않습니다.', false); return; }
  document.title = 'PDF 번역 · ' + srcUrl.host;
  $('title').textContent = guessTitle(null);

  let data;
  try {
    setStatus('다운로드 중…');
    data = await download();
  } catch (e) {
    setStatus('PDF를 불러오지 못했습니다', 'error');
    showMessage('PDF를 불러오지 못했습니다 (' + (e && e.message || e) + '). 로그인이 필요한 PDF일 수 있습니다.', true);
    return;
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('../vendor/pdfjs/build/pdf.worker.min.mjs', import.meta.url).href;
  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({
      data,
      cMapUrl: new URL('../vendor/pdfjs/cmaps/', import.meta.url).href,
      cMapPacked: true,
      standardFontDataUrl: new URL('../vendor/pdfjs/standard_fonts/', import.meta.url).href,
      isEvalSupported: false,
    }).promise;
  } catch (e) {
    setStatus('PDF를 열 수 없습니다', 'error');
    showMessage('PDF를 열 수 없습니다 (' + (e && e.message || e) + ').', true);
    return;
  }
  state.pdf = pdf;
  state.pages = Array.from({ length: pdf.numPages }, () => ({}));
  const meta = await pdf.getMetadata().catch(() => null);
  state.title = guessTitle(meta);
  $('title').textContent = state.title;
  setStatus('분석 중… (' + pdf.numPages + '쪽)');

  const first = await pdf.getPage(1);
  const vp1 = first.getViewport({ scale: 1 });
  const holder = $('pages');
  state.pages.forEach((rec, i) => {
    rec.shell = buildPageShell(i + 1);
    const w = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--page-w')) || 560;
    rec.shell.orig.style.width = w + 'px';
    rec.shell.orig.style.height = Math.round((w * vp1.height) / vp1.width) + 'px';
    holder.append(rec.shell.sec);
  });

  try { await analyzeSample(); } catch (e) { setStatus('텍스트 분석 실패', 'error'); }
  if (state.noText) { setStatus('텍스트 없음 (OCR 미지원)', 'error'); }
  else if (state.lang === 'ko') setStatus('한국어 문서 — 번역 생략');
  else if (pdf.numPages > 300) setStatus(pdf.numPages + '쪽 — 보이는 쪽만 처리합니다');
  else setStatus('준비됨 · ' + pdf.numPages + '쪽');
  setupObserver();
}

main().catch((e) => { setStatus('오류', 'error'); showMessage('뷰어 오류: ' + (e && e.message || e), true); });
