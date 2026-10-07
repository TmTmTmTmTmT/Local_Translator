// 콘텐츠 스크립트 진입점: 가시 블록 감지 -> 큐/배치 -> 번역 요청 -> rAF 적용, 동적 콘텐츠 관찰(PLAN §4.5, §4.5.1).
(function () {
  'use strict';

  const KT = (globalThis.KT = globalThis.KT || {});
  // background.js와 동일 문자열(PROTOCOL §2).
  const MSG = { TRANSLATE: 'translate', TOGGLE_ORIGINAL: 'toggleOriginal', REPORT_STATUS: 'reportStatus' };
  const DEFAULTS = {
    debounceMs: 50,
    mutationDebounceMs: 300,
    reportDebounceMs: 200,
    tickLimit: 200,
    maxBatchChars: 6000,
    maxBatchBlocks: 40,
    cacheSize: 2000,
    rootMargin: '0px 0px 150% 0px',
  };

  let S = null; // 실행 상태(없으면 정지)

  function defaultSend(msg) {
    if (globalThis.browser && globalThis.browser.runtime) return globalThis.browser.runtime.sendMessage(msg);
    const api = globalThis.chrome;
    return new Promise((resolve, reject) => {
      api.runtime.sendMessage(msg, (resp) => {
        const err = api.runtime.lastError;
        if (err) reject(new Error(err.message)); else resolve(resp);
      });
    });
  }

  class LRU {
    constructor(cap) { this.cap = cap; this.map = new Map(); }
    get(k) {
      if (!this.map.has(k)) return undefined;
      const v = this.map.get(k);
      this.map.delete(k); this.map.set(k, v);
      return v;
    }
    set(k, v) {
      this.map.delete(k); this.map.set(k, v);
      while (this.map.size > this.cap) this.map.delete(this.map.keys().next().value);
    }
  }

  // 문서가 이미 한국어 중심이면 아무것도 하지 않음. 전체 textContent를 만들지 않도록 앞부분만 샘플링.
  function shouldRun(doc) {
    const lang = (doc.documentElement && doc.documentElement.getAttribute('lang')) || '';
    if (/^ko(\b|-|_)/i.test(lang.trim())) return false;
    let sample = doc.title || '';
    if (doc.body) {
      const w = doc.createTreeWalker(doc.body, 0x4);
      let n;
      while (sample.length < 2000 && (n = w.nextNode())) sample += ' ' + n.nodeValue;
    }
    return KT.text.hangulRatio(sample) < 0.5;
  }

  function cacheKey(rec) { return rec.lang + '|' + JSON.stringify(rec.block.items); }

  function docOrder(a, b) {
    const na = a.slots[0].node, nb = b.slots[0].node;
    if (na === nb) return 0;
    if (na.getRootNode() === nb.getRootNode()) {
      const p = na.compareDocumentPosition(nb);
      if (p & 4) return -1; // nb follows na
      if (p & 2) return 1;
    }
    return a.seq - b.seq; // 다른 트리(shadow)는 등록 순서
  }

  // 순수 함수: 문서 순서로 정렬된 레코드를 언어·글자·블록 한도로 연속 묶음 분할.
  function makeBatches(recs, maxChars, maxBlocks) {
    const out = [];
    let cur = null;
    for (const r of recs) {
      if (!cur || cur.lang !== r.lang || cur.recs.length >= maxBlocks || (cur.chars + r.chars > maxChars && cur.recs.length)) {
        cur = { lang: r.lang, chars: 0, recs: [] };
        out.push(cur);
      }
      cur.recs.push(r);
      cur.chars += r.chars;
    }
    return out;
  }

  function start(options) {
    if (S) stop();
    const opt = Object.assign({}, DEFAULTS, options || {});
    const win = opt.window || globalThis;
    const doc = opt.document || win.document;
    if (!opt.force && !shouldRun(doc)) return null;

    const send = opt.send || defaultSend;
    const raf = opt.raf || ((f) => (win.requestAnimationFrame ? win.requestAnimationFrame(f) : win.setTimeout(f, 16)));
    const idle = opt.idle || ((f) => (win.requestIdleCallback ? win.requestIdleCallback(f, { timeout: 200 }) : win.setTimeout(f, 0)));
    const applier = KT.createApplier();
    const cache = new LRU(opt.cacheSize);
    const handled = new WeakSet(); // 이미 블록에 등록된 텍스트 노드
    const slotOf = new WeakMap(); // node -> slot (등록 시점 원문)
    const byEl = new Map(); // IntersectionObserver 대기 중 el -> recs
    const live = new Set(); // observed/queued/inflight 레코드
    const shadowSeen = new WeakSet();
    const st = {
      applier, cache, queue: [], applyQueue: [], inflight: 0, flushTimer: null, mutTimer: null, tickPending: false,
      rafPending: false, reportTimer: null, seq: 0, done: 0, error: 0, lastReport: '', lastUrl: win.location ? win.location.href : '',
      work: [], chars: new Set(), workSet: new Set(), needPrune: false, shadowTodo: [],
      metrics: { requests: 0, cacheHits: 0, ticks: 0, maxUnitsPerTick: 0 }, stopped: false,
    };
    S = st;

    function langHost() { return (win.location && win.location.hostname) || ''; }

    // ---------- 등록 / 관찰 ----------
    function observeShadow(sr) {
      if (shadowSeen.has(sr)) return;
      shadowSeen.add(sr);
      st.shadowTodo.push(sr);
    }
    function scan(root) {
      const recs = KT.collectBlocks(root, {
        excludeSelector: opt.excludeSelector,
        isHandled: (n) => handled.has(n),
        onShadowRoot: observeShadow,
      });
      register(recs);
      while (st.shadowTodo.length) {
        const sr = st.shadowTodo.pop();
        if (st.mo) st.mo.observe(sr, { childList: true, subtree: true, characterData: true });
        scan(sr);
      }
    }
    function register(recs) {
      for (const rec of recs) {
        rec.seq = ++st.seq;
        rec.state = 'observed';
        live.add(rec);
        for (const s of rec.slots) { handled.add(s.node); slotOf.set(s.node, s); }
        if (st.io) {
          let arr = byEl.get(rec.el);
          if (!arr) { arr = []; byEl.set(rec.el, arr); }
          arr.push(rec);
          st.io.observe(rec.el);
        } else enqueue(rec);
      }
    }
    function onIntersect(entries) {
      if (st.stopped) return;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target;
        st.io.unobserve(el);
        const arr = byEl.get(el);
        byEl.delete(el);
        if (arr) for (const rec of arr) if (rec.state === 'observed') enqueue(rec);
      }
    }

    // ---------- 큐 / 배치 ----------
    function enqueue(rec) {
      rec.state = 'queued';
      st.queue.push(rec);
      applier.markPending(rec);
      if (!st.flushTimer) st.flushTimer = win.setTimeout(flush, opt.debounceMs);
    }
    function drop(rec) { rec.state = 'dropped'; live.delete(rec); }
    function flush() {
      st.flushTimer = null;
      if (st.stopped) return;
      const q = st.queue.filter((r) => {
        if (r.state !== 'queued') return false;
        if (!r.el.isConnected || !r.slots.some((s) => s.node.isConnected)) { drop(r); return false; }
        return true;
      });
      st.queue = [];
      if (!q.length) return;
      q.sort(docOrder);
      const misses = [];
      for (const r of q) {
        const hit = cache.get(cacheKey(r));
        if (hit) { st.metrics.cacheHits++; r.state = 'inflight'; st.applyQueue.push({ rec: r, slots: hit }); }
        else misses.push(r);
      }
      if (st.applyQueue.length) scheduleApply();
      for (const b of makeBatches(misses, opt.maxBatchChars, opt.maxBatchBlocks)) sendBatch(b);
      reportSoon();
    }
    function sendBatch(batch) {
      for (const r of batch.recs) r.state = 'inflight';
      st.inflight++;
      st.metrics.requests++;
      const msg = { type: MSG.TRANSLATE, blocks: batch.recs.map((r) => r.block), context: { title: doc.title || '', host: langHost() }, lang: batch.lang };
      let p;
      try { p = Promise.resolve(send(msg)); } catch (e) { p = Promise.reject(e); }
      p.then((resp) => onResponse(batch, resp), () => onResponse(batch, null))
        .finally(() => { st.inflight--; reportSoon(); });
    }
    function onResponse(batch, resp) {
      if (st.stopped) return;
      const byId = new Map();
      if (resp && resp.ok && Array.isArray(resp.results)) for (const x of resp.results) if (x) byId.set(x.id, x.slots);
      for (const r of batch.recs) {
        const slots = byId.get(r.id);
        if (!slots) { st.applyQueue.push({ rec: r, slots: null }); continue; }
        let all = true;
        for (let i = 0; i < r.slots.length; i++) if (typeof slots[String(i)] !== 'string') all = false;
        if (all) cache.set(cacheKey(r), slots);
        st.applyQueue.push({ rec: r, slots });
      }
      scheduleApply();
    }
    function scheduleApply() {
      if (st.rafPending) return;
      st.rafPending = true;
      raf(() => {
        st.rafPending = false;
        if (st.stopped) return;
        const items = st.applyQueue;
        st.applyQueue = [];
        for (const { rec, slots } of items) {
          live.delete(rec);
          if (!rec.el.isConnected || !rec.slots.some((s) => s.node.isConnected)) { rec.state = 'dropped'; continue; } // 제거된 블록 결과 폐기
          if (!slots) { applier.markError(rec); rec.state = 'error'; st.error++; continue; }
          const res = applier.apply(rec, slots);
          if (res.status === 'error') { rec.state = 'error'; st.error++; } else { rec.state = 'done'; if (res.status === 'done') st.done++; }
        }
        reportSoon();
      });
    }

    // ---------- 상태 보고 ----------
    function counts() {
      let pending = 0;
      for (const r of live) if (r.state === 'queued' || r.state === 'inflight') pending++;
      return { pending, done: st.done, error: st.error };
    }
    function reportSoon() {
      if (st.reportTimer || st.stopped) return;
      st.reportTimer = win.setTimeout(() => {
        st.reportTimer = null;
        const c = counts();
        const key = JSON.stringify(c);
        if (key === st.lastReport) return;
        st.lastReport = key;
        try { Promise.resolve(send(Object.assign({ type: MSG.REPORT_STATUS }, c))).catch(() => {}); } catch (_) { /* 보고 실패는 무시 */ }
      }, opt.reportDebounceMs);
    }

    // ---------- 동적 콘텐츠 ----------
    function onMutations(list) {
      if (st.stopped) return;
      for (const m of list) {
        if (m.type === 'childList') {
          for (const n of m.addedNodes) if (!st.workSet.has(n)) { st.workSet.add(n); st.work.push(n); }
          if (m.removedNodes.length) st.needPrune = true;
        } else if (m.type === 'characterData') st.chars.add(m.target);
      }
      if (!st.mutTimer && !st.tickPending) st.mutTimer = win.setTimeout(() => { st.mutTimer = null; runTick(); }, opt.mutationDebounceMs);
    }
    function runTick() {
      st.tickPending = true;
      idle(() => {
        st.tickPending = false;
        if (st.stopped) return;
        processWork();
      });
    }
    function handleChar(node) {
      if (!node.isConnected) return;
      const rec = applier.get(node);
      if (rec) {
        if (node.nodeValue === rec.translated) return; // 자기 쓰기
        if (node.nodeValue === rec.original) { applier.reapply(node); return; } // 페이지가 원문으로 되돌림(원문 모드면 무시됨)
        applier.forget(node); // 페이지가 새 값을 씀 -> 새 노드처럼 재번역
        handled.delete(node);
        scan(node);
        return;
      }
      const slot = slotOf.get(node);
      if (slot && handled.has(node)) {
        if (node.nodeValue !== slot.original) { handled.delete(node); scan(node); }
        return;
      }
      if (!handled.has(node)) scan(node);
    }
    function pruneRemoved() {
      applier.prune();
      for (const r of Array.from(live)) {
        if (r.state === 'inflight') continue; // 응답 시 isConnected 검사로 폐기
        if (!r.el.isConnected) {
          drop(r);
          const arr = byEl.get(r.el);
          if (arr) { byEl.delete(r.el); if (st.io) st.io.unobserve(r.el); }
        }
      }
    }
    function processWork() {
      checkUrl();
      let budget = opt.tickLimit;
      let units = 0;
      if (st.needPrune) { st.needPrune = false; pruneRemoved(); }
      if (st.chars.size) {
        const arr = Array.from(st.chars);
        st.chars = new Set();
        for (let i = 0; i < arr.length; i++) {
          if (budget <= 0) { for (let j = i; j < arr.length; j++) st.chars.add(arr[j]); break; }
          budget--; units++;
          handleChar(arr[i]);
        }
      }
      while (st.work.length && budget > 0) {
        const n = st.work.shift();
        st.workSet.delete(n);
        if (!n.isConnected) continue;
        budget--; units++;
        // 큰 서브트리는 자식 단위로 쪼개 다음 틱들에 분배
        if (n.nodeType === 1 && n.childNodes.length > opt.tickLimit) {
          const kids = Array.from(n.childNodes);
          for (const k of kids) st.workSet.add(k);
          st.work = kids.concat(st.work);
          if (n.shadowRoot) { st.work.unshift(n.shadowRoot); }
          continue;
        }
        scan(n);
      }
      st.metrics.ticks++;
      st.metrics.maxUnitsPerTick = Math.max(st.metrics.maxUnitsPerTick, units);
      if (st.work.length || st.chars.size) runTick();
    }

    // ---------- SPA ----------
    function checkUrl() {
      const href = win.location ? win.location.href : '';
      if (href !== st.lastUrl) { st.lastUrl = href; onUrlChange(); }
    }
    function onUrlChange() {
      if (st.stopped) return;
      st.queue = [];
      if (st.flushTimer) { win.clearTimeout(st.flushTimer); st.flushTimer = null; }
      for (const r of live) {
        if (r.state !== 'queued') continue;
        r.state = 'observed';
        if (st.io) {
          let arr = byEl.get(r.el);
          if (!arr) { arr = []; byEl.set(r.el, arr); }
          if (!arr.includes(r)) arr.push(r);
        }
      }
      if (st.io) for (const el of byEl.keys()) { st.io.unobserve(el); st.io.observe(el); } // 현재 화면 블록 재감지
    }
    const onNav = () => checkUrl();
    win.addEventListener('popstate', onNav);
    win.addEventListener('hashchange', onNav);
    // 격리 월드에서는 페이지의 pushState 호출을 못 잡을 수 있어 변이 틱의 URL 비교로 보완한다.
    const hist = win.history;
    const origPush = hist && hist.pushState, origReplace = hist && hist.replaceState;
    let wrapPush = null, wrapReplace = null;
    if (hist) {
      wrapPush = function () { const r = origPush.apply(this, arguments); checkUrl(); return r; };
      wrapReplace = function () { const r = origReplace.apply(this, arguments); checkUrl(); return r; };
      hist.pushState = wrapPush;
      hist.replaceState = wrapReplace;
    }

    // ---------- 메시지 ----------
    function handleMessage(msg) {
      if (msg && msg.type === MSG.TOGGLE_ORIGINAL) {
        if (applier.mode === 'translation') applier.showOriginal(); else applier.showTranslation();
        return { mode: applier.mode === 'translation' ? 'translated' : 'original' };
      }
      return undefined;
    }
    const api = globalThis.browser || globalThis.chrome;
    const hasListener = !!(opt.listen !== false && api && api.runtime && api.runtime.onMessage && api.runtime.onMessage.addListener);
    const listener = (msg, _sender, sendResponse) => {
      const r = handleMessage(msg);
      if (r === undefined) return undefined;
      if (globalThis.browser) return Promise.resolve(r);
      if (sendResponse) sendResponse(r);
      return true;
    };
    if (hasListener) api.runtime.onMessage.addListener(listener);

    // ---------- 시작 ----------
    const IO = opt.IntersectionObserver || win.IntersectionObserver;
    if (IO) st.io = new IO(onIntersect, { rootMargin: opt.rootMargin });
    const MO = opt.MutationObserver || win.MutationObserver;
    if (MO) {
      st.mo = new MO(onMutations);
      st.mo.observe(doc, { childList: true, subtree: true, characterData: true });
    }
    st.teardown = () => {
      st.stopped = true;
      for (const k of ['flushTimer', 'mutTimer', 'reportTimer']) if (st[k]) { win.clearTimeout(st[k]); st[k] = null; }
      if (st.io) st.io.disconnect();
      if (st.mo) st.mo.disconnect();
      win.removeEventListener('popstate', onNav);
      win.removeEventListener('hashchange', onNav);
      if (hist) {
        if (hist.pushState === wrapPush) hist.pushState = origPush;
        if (hist.replaceState === wrapReplace) hist.replaceState = origReplace;
      }
      if (hasListener && api.runtime.onMessage.removeListener) api.runtime.onMessage.removeListener(listener);
      byEl.clear(); live.clear();
    };
    st.handleMessage = handleMessage;
    st.busy = () => !!(st.flushTimer || st.mutTimer || st.tickPending || st.inflight || st.applyQueue.length || st.rafPending ||
      st.work.length || st.chars.size);
    st.win = win;
    st.counts = counts;
    st.onUrlChange = checkUrl;

    scan(doc.body || doc.documentElement);
    reportSoon();
    return st;
  }

  function stop() {
    if (!S) return;
    S.teardown();
    S = null;
  }

  // 테스트용: 모든 타이머·요청·적용이 끝날 때까지 대기.
  async function idle(maxMs) {
    const st = S;
    if (!st) return;
    const win = st.win;
    const sleep = (ms) => new Promise((r) => win.setTimeout(r, ms));
    const t0 = Date.now();
    await sleep(0);
    while (st.busy() && Date.now() - t0 < (maxMs || 3000)) await sleep(2);
    await sleep(0);
  }

  function handleMessage(msg) { return S ? S.handleMessage(msg) : undefined; }

  function autoStart() {
    const api = globalThis.browser || globalThis.chrome;
    const host = (globalThis.location && globalThis.location.hostname || '').toLowerCase();
    const go = (settings) => {
      if (settings && settings.enabled === false) return;
      let ex = [];
      for (const s of (settings && settings.sites) || []) {
        const h = String((s && s.host) || s || '').toLowerCase().replace(/^\*\./, '');
        if (h && (host === h || host.endsWith('.' + h)) && s.exclude) ex.push(s.exclude);
      }
      start({ excludeSelector: ex.join(',') });
    };
    try {
      if (api && api.storage && api.storage.sync) {
        const p = api.storage.sync.get('settings');
        if (p && p.then) { p.then((r) => go(r && r.settings), () => go(null)); return; }
      }
    } catch (_) { /* 설정 없이 기본값으로 */ }
    go(null);
  }

  KT.main = {
    start, stop, idle, handleMessage, makeBatches, shouldRun, MSG,
    get state() { return S; },
    get applier() { return S && S.applier; },
  };

  if (globalThis.__KT_AUTOSTART !== false) autoStart();
})();
