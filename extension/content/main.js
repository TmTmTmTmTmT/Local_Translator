// 콘텐츠 스크립트 진입점: 가시 블록 감지 -> 큐/배치 -> 번역 요청 -> rAF 적용, 동적 콘텐츠 관찰(PLAN §4.5, §4.5.1).
(function () {
  'use strict';

  const KT = (globalThis.KT = globalThis.KT || {});
  // translateAttrs: 속성 번역(extra.js가 주입된 경우에만 동작). fixParticles: 조사 병기 확정(apply.js).
  const DEFAULTS = { debounceMs: 50, mutationDebounceMs: 300, reportDebounceMs: 200, sendTimeoutMs: 90000, tickLimit: 200, fixParticles: true, translateAttrs: false, linkMode: 'standalone' };
  const MAX_BATCH_CHARS = 1500, MAX_BATCH_BLOCKS = 10, CACHE_SIZE = 2000;
  // 페이지 첫 요청은 작게 보내 첫 번역이 빨리 보이게 한다(엔진이 배치를 직렬로 처리하므로 첫 결과 지연 = 첫 배치 크기).
  const FIRST_BATCH_BLOCKS = 4;

  let S = null; // 실행 상태(없으면 정지)

  function defaultSend(msg) {
    if (globalThis.browser && globalThis.browser.runtime) return globalThis.browser.runtime.sendMessage(msg);
    const rt = globalThis.chrome.runtime;
    return new Promise((resolve, reject) => rt.sendMessage(msg, (resp) => (rt.lastError ? reject(new Error(rt.lastError.message)) : resolve(resp))));
  }

  // Map 삽입 순서로 LRU 구현.
  const lru = (cap) => {
    const m = new Map();
    return {
      get(k) { const v = m.get(k); if (v !== undefined) { m.delete(k); m.set(k, v); } return v; },
      set(k, v) { m.delete(k); m.set(k, v); if (m.size > cap) m.delete(m.keys().next().value); },
    };
  };

  // 문서가 이미 한국어 중심이면 아무것도 하지 않음. 전체 textContent를 만들지 않도록 앞부분만 샘플링.
  function shouldRun(doc) {
    if (/^ko(\b|-|_)/i.test(((doc.documentElement && doc.documentElement.getAttribute('lang')) || '').trim())) return false;
    let sample = doc.title || '';
    if (doc.body) {
      const w = doc.createTreeWalker(doc.body, 0x4);
      for (let n; sample.length < 2000 && (n = w.nextNode());) sample += ' ' + n.nodeValue;
    }
    return KT.text.hangulRatio(sample) < 0.5;
  }

  const cacheKey = (rec) => rec.lang + '|' + JSON.stringify(rec.block.items);
  const attached = (r) => r.el.isConnected && r.slots.some((s) => s.node.isConnected);

  function docOrder(a, b) {
    const na = a.slots[0].node, nb = b.slots[0].node;
    const p = na.getRootNode() === nb.getRootNode() && na !== nb ? na.compareDocumentPosition(nb) : 0;
    return na === nb ? 0 : p & 4 ? -1 : p & 2 ? 1 : a.seq - b.seq; // 다른 트리(shadow)는 등록 순서
  }

  // 문서 순서로 정렬된 레코드를 언어·글자·블록 한도로 연속 묶음 분할.
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

  // 뷰포트 안 블록(priority 1)을 먼저, 그 안에서는 문서 순. 화면 밖(rootMargin 영역)은 priority 0.
  function byPriority(a, b) { return ((b.priority | 0) - (a.priority | 0)) || docOrder(a, b); }

  // 아직 아무 요청도 보내지 않았다면 첫 배치를 n블록으로 줄이고 나머지는 바로 뒤 배치로 보낸다.
  function capFirst(batches, n) {
    const b = batches[0];
    if (!b || b.recs.length <= n) return batches;
    const rest = { lang: b.lang, priority: b.priority, chars: 0, recs: b.recs.slice(n) };
    for (const r of rest.recs) rest.chars += r.chars;
    b.recs = b.recs.slice(0, n);
    b.chars -= rest.chars;
    return [b, rest].concat(batches.slice(1));
  }

  function start(options) {
    if (S) stop();
    const opt = Object.assign({}, DEFAULTS, options || {});
    const win = globalThis;
    const doc = win.document;
    if (!shouldRun(doc)) return null;

    const send = opt.send || defaultSend;
        const idle = (f) => (win.requestIdleCallback ? win.requestIdleCallback(f, { timeout: 200 }) : win.setTimeout(f, 0));
    const applier = KT.createApplier({ fixParticles: opt.fixParticles !== false });
    const cache = lru(CACHE_SIZE);
    const handled = new WeakSet();
    const slotOf = new WeakMap();
    const byEl = new Map();
    const tracked = new Set();
    const shadowSeen = new WeakSet();
    const st = {
      applier, queue: [], applyQueue: [], inflight: 0, flushTimer: null, mutTimer: null, tickPending: false,
      rafPending: false, firstSent: false, reportTimer: null, seq: 0, done: 0, error: 0, lastReport: '', lastUrl: win.location ? win.location.href : '',
      sendTimers: new Set(), lastPending: -1, work: [], chars: new Set(), workSet: new Set(), needPrune: false, shadowTodo: [],
      metrics: { requests: 0, cacheHits: 0, ticks: 0, maxUnitsPerTick: 0, ownWrites: 0, coalesced: 0, deduped: 0 }, stopped: false,
    };
    S = st;
    const timer = (k, ms, fn) => { if (!st[k]) st[k] = win.setTimeout(() => { st[k] = null; fn(); }, ms); };
    const watchOpts = { childList: true, subtree: true, characterData: true };

    // ---------- 등록 / 관찰 ----------
    function scan(root) {
      register(KT.collectBlocks(root, {
        excludeSelector: opt.excludeSelector,
        linkMode: opt.linkMode,
        isHandled: (n) => handled.has(n),
        onShadowRoot: (sr) => { if (!shadowSeen.has(sr)) { shadowSeen.add(sr); st.shadowTodo.push(sr); } },
      }));
      if (opt.translateAttrs && KT.extra) register(KT.extra.collectAttrs(root, opt.excludeSelector));
      while (st.shadowTodo.length) {
        const sr = st.shadowTodo.pop();
        st.mo.observe(sr, watchOpts);
        scan(sr);
      }
    }
    function observeRec(rec) {
      let arr = byEl.get(rec.el);
      if (!arr) byEl.set(rec.el, (arr = []));
      if (!arr.includes(rec)) arr.push(rec);
    }
    function register(recs) {
      for (const rec of recs) {
        rec.seq = ++st.seq;
        rec.state = 'observed';
        tracked.add(rec);
        for (const s of rec.slots) if (!s.attr) { handled.add(s.node); slotOf.set(s.node, s); }
        observeRec(rec);
        st.io.observe(rec.el);
      }
    }
    // 교차 정보에 위치가 없으면(스텁 등) 뷰포트 안으로 본다. innerHeight 읽기는 레이아웃을 강제하지 않는다.
    function priorityOf(e) {
      const r = e.boundingClientRect, vh = win.innerHeight;
      if (!r || !vh) return 1;
      return r.bottom > 0 && r.top < vh ? 1 : 0;
    }
    function onIntersect(entries) {
      if (st.stopped) return;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const pr = priorityOf(e);
        const arr = byEl.get(e.target);
        st.io.unobserve(e.target);
        byEl.delete(e.target);
        if (arr) for (const rec of arr) if (rec.state === 'observed') { rec.priority = pr; enqueue(rec); }
      }
    }

    // ---------- 큐 / 배치 ----------
    function enqueue(rec) {
      rec.state = 'queued';
      st.queue.push(rec);
      applier.markPending(rec);
      timer('flushTimer', opt.debounceMs, flush);
    }
    function drop(rec) { rec.state = 'dropped'; tracked.delete(rec); }
    function flush() {
      if (st.stopped) return;
      const q = st.queue.filter((r) => {
        if (r.state !== 'queued') return false;
        if (!attached(r)) { drop(r); return false; }
        return true;
      });
      st.queue = [];
      if (!q.length) return;
      q.sort(byPriority);
      const misses = [];
      for (const r of q) {
        const hit = cache.get(cacheKey(r));
        if (hit) { st.metrics.cacheHits++; r.state = 'inflight'; st.applyQueue.push({ rec: r, slots: hit }); }
        else misses.push(r);
      }
      if (st.applyQueue.length) scheduleApply();
      const batches = [];
      for (const pr of [1, 0]) {
        for (const b of makeBatches(misses.filter((r) => (r.priority | 0) === pr), MAX_BATCH_CHARS, MAX_BATCH_BLOCKS)) { b.priority = pr; batches.push(b); }
      }
      for (const b of st.firstSent ? batches : capFirst(batches, FIRST_BATCH_BLOCKS)) sendBatch(b);
      reportSoon();
    }
    function sendBatch(batch) {
      for (const r of batch.recs) r.state = 'inflight';
      st.inflight++;
      st.metrics.requests++;
      st.firstSent = true;
      const msg = { type: 'translate', priority: batch.priority | 0, blocks: batch.recs.map((r) => r.block), context: { title: doc.title || '', host: (win.location && win.location.hostname) || '' }, lang: batch.lang };
      // 응답 유실 시 영원히 inflight로 남지 않도록 기한을 둔다(기한 후 도착한 응답은 무시).
      let settled = false, tm = null;
      const finish = (resp) => {
        if (settled) return;
        settled = true;
        if (tm) { win.clearTimeout(tm); st.sendTimers.delete(tm); }
        try { onResponse(batch, resp); } finally { st.inflight--; reportSoon(); }
      };
      tm = win.setTimeout(() => finish(null), opt.sendTimeoutMs);
      st.sendTimers.add(tm);
      let p;
      try { p = Promise.resolve(send(msg)); } catch (e) { p = Promise.reject(e); }
      p.then(finish, () => finish(null));
    }
    function onResponse(batch, resp) {
      if (st.stopped) return;
      const byId = new Map();
      if (resp && resp.ok && Array.isArray(resp.results)) for (const x of resp.results) if (x) byId.set(x.id, x.slots);
      for (const r of batch.recs) {
        const slots = byId.get(r.id);
        // 모든 슬롯이 문자열일 때만 캐시
        if (slots && r.slots.every((_, i) => typeof slots[String(i)] === 'string')) cache.set(cacheKey(r), slots);
        st.applyQueue.push({ rec: r, slots: slots || null });
      }
      scheduleApply();
    }
    function scheduleApply() {
      if (st.rafPending) return;
      st.rafPending = true;
      win.requestAnimationFrame(() => {
        st.rafPending = false;
        if (st.stopped) return;
        const items = st.applyQueue;
        st.applyQueue = [];
        for (const { rec, slots } of items) {
          tracked.delete(rec);
          if (!attached(rec)) { rec.state = 'dropped'; continue; }
          const res = slots ? applier.apply(rec, slots) : { status: 'error' };
          if (!slots) applier.markError(rec);
          if (res.status === 'error') { rec.state = 'error'; st.error++; } else { rec.state = 'done'; if (res.status === 'done') st.done++; }
        }
        reportSoon();
      });
    }

    // ---------- 상태 보고 ----------
    function counts() {
      let pending = 0;
      for (const r of tracked) if (r.state === 'queued' || r.state === 'inflight') pending++;
      return { pending, done: st.done, error: st.error };
    }
    function sendReport() {
      const c = counts();
      const key = JSON.stringify(c);
      st.lastPending = c.pending;
      if (key === st.lastReport) return;
      st.lastReport = key;
      try { Promise.resolve(send(Object.assign({ type: 'reportStatus' }, c))).catch(() => {}); } catch (_) { /* 보고 실패는 무시 */ }
    }
    // 0으로 떨어지거나 0에서 벗어나는 순간은 디바운스 없이 즉시 보고해 마지막 값(0)이 유실되지 않게 한다.
    function reportSoon() {
      if (st.stopped) return;
      const pending = counts().pending;
      if (pending === 0 || st.lastPending === 0) {
        if (st.reportTimer) { win.clearTimeout(st.reportTimer); st.reportTimer = null; }
        sendReport();
        return;
      }
      timer('reportTimer', opt.reportDebounceMs, sendReport);
    }

    // ---------- 동적 콘텐츠 ----------
    function onMutations(list) {
      if (st.stopped) return;
      for (const m of list) {
        if (m.type === 'childList') {
          for (const n of m.addedNodes) {
            if (st.workSet.has(n)) st.metrics.coalesced++;
            else if (queuedAncestor(n)) st.metrics.deduped++;
            else { st.workSet.add(n); st.work.push(n); }
          }
          if (m.removedNodes.length) st.needPrune = true;
        } else if (m.type === 'characterData') {
          // 루프 가드: 우리가 쓴 값이면 즉시 무시. 같은 타깃의 반복 변경은 최종 상태 한 번만 처리.
          if (applier.isOwnWrite(m.target)) st.metrics.ownWrites++;
          else if (st.chars.has(m.target)) st.metrics.coalesced++;
          else st.chars.add(m.target);
        }
      }
      if (!st.tickPending) timer('mutTimer', opt.mutationDebounceMs, runTick);
    }
    function runTick() {
      st.tickPending = true;
      idle(() => {
        st.tickPending = false;
        if (!st.stopped) processWork();
      });
    }
    function handleChar(node) {
      if (!node.isConnected) return;
      const rec = applier.get(node);
      if (rec) {
        if (node.nodeValue === rec.translated) return;
        if (node.nodeValue === rec.original) { applier.reapply(node); return; } // 페이지가 원문으로 되돌림(원문 모드면 무시됨)
        applier.forget(node); // 페이지가 새 값을 씀 -> 새 노드처럼 재번역
        handled.delete(node);
        scan(node);
        return;
      }
      const slot = slotOf.get(node);
      if (slot && handled.has(node)) {
        if (node.nodeValue !== slot.original) { handled.delete(node); scan(node); }
      } else if (!handled.has(node)) scan(node);
    }
    function pruneRemoved() {
      applier.prune();
      for (const r of Array.from(tracked)) {
        if (r.state === 'inflight' || r.el.isConnected) continue; // inflight는 응답 시 isConnected 검사로 폐기
        drop(r);
        if (byEl.delete(r.el)) st.io.unobserve(r.el);
      }
    }
    // 조상이 아직 대기 중이면 그 스캔이 이 노드를 포함하므로 따로 처리하지 않는다.
    function queuedAncestor(n) {
      for (let p = n.parentNode; p; p = p.parentNode) if (st.workSet.has(p)) return true;
      return false;
    }
    function processWork() {
      checkUrl();
      let budget = opt.tickLimit, units = 0;
      if (st.needPrune) { st.needPrune = false; pruneRemoved(); }
      if (st.chars.size) {
        const arr = Array.from(st.chars);
        st.chars = new Set();
        for (let i = 0; i < arr.length; i++) {
          if (budget <= 0) { for (let j = i; j < arr.length; j++) st.chars.add(arr[j]); break; }
          if (!handled.has(arr[i]) && queuedAncestor(arr[i])) { st.metrics.deduped++; continue; }
          budget--; units++;
          handleChar(arr[i]);
        }
      }
      while (st.work.length && budget > 0) {
        const n = st.work.shift();
        st.workSet.delete(n);
        if (!n.isConnected) continue;
        if (queuedAncestor(n)) { st.metrics.deduped++; continue; }
        budget--; units++;
        // 큰 서브트리는 자식 단위로 쪼개 다음 틱들에 분배
        if (n.nodeType === 1 && n.childNodes.length > opt.tickLimit) {
          const kids = Array.from(n.childNodes);
          for (const k of kids) st.workSet.add(k);
          st.work = kids.concat(st.work);
          if (n.shadowRoot) st.work.unshift(n.shadowRoot);
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
      if (href === st.lastUrl) return;
      st.lastUrl = href;
      if (st.stopped) return;
      st.queue = [];
      if (st.flushTimer) { win.clearTimeout(st.flushTimer); st.flushTimer = null; }
      for (const r of tracked) if (r.state === 'queued') { r.state = 'observed'; observeRec(r); }
      for (const el of byEl.keys()) { st.io.unobserve(el); st.io.observe(el); } // 현재 화면 블록 재감지
    }
    const onNav = () => checkUrl();
    win.addEventListener('popstate', onNav);
    win.addEventListener('hashchange', onNav);
    // 격리 월드에서는 페이지의 pushState 호출을 못 잡을 수 있어 변이 틱의 URL 비교로 보완한다.
    const hist = win.history;
    const orig = {}, wrap = {};
    for (const k of hist ? ['pushState', 'replaceState'] : []) {
      orig[k] = hist[k];
      hist[k] = wrap[k] = function () { const r = orig[k].apply(this, arguments); checkUrl(); return r; };
    }

    // ---------- 메시지 ----------
    function handleMessage(msg) {
      if (!msg) return undefined;
      if (msg.type === 'getMode') return { mode: applier.mode === 'translation' ? 'translated' : 'original' };
      if (msg.type !== 'toggleOriginal') return undefined;
      if (applier.mode === 'translation') applier.showOriginal(); else applier.showTranslation();
      return { mode: applier.mode === 'translation' ? 'translated' : 'original' };
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
    st.io = new win.IntersectionObserver(onIntersect, { rootMargin: '0px 0px 150% 0px' });
    st.mo = new win.MutationObserver(onMutations);
    st.mo.observe(doc, watchOpts);
    st.teardown = () => {
      st.stopped = true;
      for (const k of ['flushTimer', 'mutTimer', 'reportTimer']) if (st[k]) { win.clearTimeout(st[k]); st[k] = null; }
      for (const t of st.sendTimers) win.clearTimeout(t);
      st.sendTimers.clear();
      st.io.disconnect();
      st.mo.disconnect();
      win.removeEventListener('popstate', onNav);
      win.removeEventListener('hashchange', onNav);
      for (const k in wrap) if (hist[k] === wrap[k]) hist[k] = orig[k];
      if (hasListener && api.runtime.onMessage.removeListener) api.runtime.onMessage.removeListener(listener);
      byEl.clear(); tracked.clear();
    };
    st.handleMessage = handleMessage;
    st.win = win;

    scan(doc.body || doc.documentElement);
    reportSoon();
    return st;
  }

  function stop() {
    if (!S) return;
    S.teardown();
    S = null;
  }

  function autoStart() {
    const api = globalThis.browser || globalThis.chrome;
    const host = (globalThis.location && globalThis.location.hostname || '').toLowerCase();
    const go = (settings) => {
      if (settings && settings.enabled === false) return;
      const ex = [];
      for (const s of (settings && settings.sites) || []) {
        const h = String((s && s.host) || s || '').toLowerCase().replace(/^\*\./, '');
        if (h && (host === h || host.endsWith('.' + h)) && s.exclude) ex.push(s.exclude);
      }
      start({ excludeSelector: ex.join(','), translateAttrs: !!(settings && settings.translateAttrs), fixParticles: !(settings && settings.fixParticles === false), linkMode: settings && settings.linkMode === 'never' ? 'never' : 'standalone' });
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
    start, stop,
    handleMessage: (msg) => (S ? S.handleMessage(msg) : undefined),
    get state() { return S; },
    get applier() { return S && S.applier; },
  };

  if (globalThis.__KT_AUTOSTART !== false) autoStart();
})();
