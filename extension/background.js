// background: 설정 로드, 콘텐츠 스크립트 동적 등록, 메시지 라우터(PROTOCOL §2), 캐시·배치·동시성, PDF 뷰어 진입.
// createBackground(deps)로 테스트 가능하게 분리; 파일 하단에서 실제 browser가 있을 때만 자동 시작.
(function () {
  'use strict';

  const MSG = {
    TRANSLATE: 'translate',
    GET_STATE: 'getState',
    SET_SITE_ENABLED: 'setSiteEnabled',
    REPORT_STATUS: 'reportStatus',
    OPEN_PDF_VIEWER: 'openPdfViewer',
    CLEAR_CACHE: 'clearCache',
    GET_SITE_CONFIG: 'getSiteConfig',
  };
  const SCRIPT_ID = 'kt-main';
  // lib/lang.js는 주입하지 않는다(content/text.js가 동일 규칙의 판정을 내장). extra.js는 설정 translateAttrs=true일 때만 main.js 앞에 추가.
  const CONTENT_JS = ['lib/josa.js', 'content/text.js', 'content/filter.js', 'content/segmenter.js', 'content/apply.js', 'content/main.js'];
  const CONTENT_EXTRA_JS = 'content/extra.js';
  const KNOWN_CODES = new Set(['needs_language_pack', 'engine_unavailable', 'rate_limited', 'bad_response', 'unsupported_lang', 'timeout', 'unknown', 'needs_safari_restart']);
  // 사용자 조치가 필요한 에러만 배지 '!'.
  const BADGE_CODES = new Set(['engine_unavailable', 'needs_language_pack', 'needs_safari_restart']);

  const DEFAULT_SETTINGS = {
    sites: [],
    engine: { default: 'native:apple-mt', byLang: { ja: null, zh: null } },
    localhost: { baseUrl: 'http://127.0.0.1:11434', kind: 'ollama', model: '', parallel: 4 },
    enabled: true,
    translateAttrs: false, // true면 content/extra.js 추가 주입(속성 번역)
    fixParticles: true, // 링크 뒤 조사 자동 보정(apply.js 옵션)
    linkMode: 'standalone', // 'standalone'(링크뿐인 블록도 번역) | 'never'(링크 항상 원문 유지)
    glossary: [], // PLAN §11.3: [{src,dst,lang?,case?}]
    pdfAuto: true, // D7(2026-10-08): 사용자 결정으로 기본 ON. Safari 실기 검증 전이므로 동작 확인 필요
  };

  const isPlain = (v) => v && typeof v === 'object' && !Array.isArray(v);

  function mergeSettings(defaults, stored) {
    const out = {};
    for (const k of Object.keys(defaults)) {
      const d = defaults[k];
      out[k] = isPlain(d) ? mergeSettings(d, isPlain(stored && stored[k]) ? stored[k] : {}) : d;
      if (!isPlain(d) && stored && stored[k] !== undefined && stored[k] !== null) out[k] = stored[k];
    }
    if (isPlain(stored)) {
      for (const k of Object.keys(stored)) if (!(k in out)) out[k] = stored[k];
    }
    return out;
  }

  // block.lang / request lang -> 엔진 언어. 미지원이면 null.
  function toEngineLang(lang) {
    const base = String(lang || '').split('-')[0];
    return base === 'en' || base === 'ja' || base === 'zh' ? base : null;
  }

  function blockChars(block) {
    let n = 0;
    for (const it of block.items || []) if (it.k === 't') n += String(it.text || '').length;
    return n;
  }

  // 엔진 batchLimit({chars, blocks})로 연속 분할. 단일 블록이 한도를 넘어도 단독 배치로 보낸다.
  function splitBatches(blocks, limit) {
    const maxChars = (limit && limit.chars) || Infinity;
    const maxBlocks = (limit && limit.blocks) || Infinity;
    const out = [];
    let cur = [];
    let chars = 0;
    for (const b of blocks) {
      const c = blockChars(b);
      if (cur.length && (cur.length >= maxBlocks || chars + c > maxChars)) { out.push(cur); cur = []; chars = 0; }
      cur.push(b);
      chars += c;
    }
    if (cur.length) out.push(cur);
    return out;
  }

  function createSemaphore(max) {
    let active = 0;
    const waiters = []; // {pr, wake}: priority 내림차순, 같으면 도착 순
    const release = () => {
      active--;
      const next = waiters.shift();
      if (next) { active++; next.wake(); }
    };
    return {
      async run(fn, priority) {
        const pr = Number.isFinite(priority) ? priority : 0;
        if (active >= Math.max(1, max | 0)) {
          await new Promise((wake) => {
            let i = waiters.length;
            while (i > 0 && waiters[i - 1].pr < pr) i--;
            waiters.splice(i, 0, { pr, wake });
          });
        } else active++;
        try { return await fn(); } finally { release(); }
      },
    };
  }

  function mapError(e) {
    const raw = e && typeof e === 'object' ? e : { message: String(e || '') };
    const code = KNOWN_CODES.has(raw.code) ? raw.code : 'unknown';
    return { code, message: raw.message || code };
  }

  function hostOfUrl(url) {
    try { return new URL(url).hostname.toLowerCase(); } catch (e) { return ''; }
  }

  const DEADLINE_SLACK_MS = 15000; // 엔진 자체 기한 뒤 여유: 응답 유실 시에도 세마포어를 반드시 해제
  const PDF_PROBE_TIMEOUT_MS = 3000;
  const PDF_CACHE_MAX = 200;
  const PDF_DEDUPE_MS = 10000;

  // 엔진이 알려주는 기한이 없으면 네이티브 Swift 핸들러 규칙(PROTOCOL §4) / localhost 블록당 60초로 추정.
  function engineDeadlineMs(engine, nBlocks) {
    if (engine && Number.isFinite(engine.deadlineMs)) return engine.deadlineMs;
    const n = Math.max(1, nBlocks | 0);
    if (engine && engine.kind === 'localhost') return 60000 * n;
    if (engine && /apple-fm$/.test(String(engine.id))) return 90000;
    return Math.min(120, 15 + 3 * n) * 1000;
  }

  // PDF 후보 판정(지정 사이트 확인 전, URL 모양만): 'pdf' 확정 | 'candidate' HEAD 확인 필요 | null.
  function classifyPdfUrl(u) {
    if (/\.pdf$/i.test(u.pathname)) return 'pdf';
    if (u.pathname.split('/').some((seg) => seg.toLowerCase() === 'pdf')) return 'candidate';
    if (/(^|&)format=pdf(&|$)/i.test(u.search.replace(/^\?/, ''))) return 'candidate';
    return null;
  }

  function createBackground(deps) {
    const d = deps || {};
    const api = d.browser;
    const KT = d.KT || globalThis.KT || {};
    const sites = d.sites || (KT.lib && KT.lib.sites);
    const hashLib = d.hash || (KT.lib && KT.lib.hash);
    const glossaryLib = d.glossary || (KT.lib && KT.lib.glossary);
    const cacheLib = d.cacheLib || (KT.lib && KT.lib.cache);
    const engines = d.engines || KT.engines;

    const cache = d.cache || cacheLib.createPersistentCache({
      load: async () => {
        const r = await api.storage.local.get('cache');
        return r && r.cache;
      },
      save: (obj) => api.storage.local.set({ cache: obj }),
    });

    let settings = null;
    let settingsJson = '';
    const tabState = new Map(); // tabId -> {pending, done, error, lastError}
    const pdfRedirected = new Map(); // tabId -> {url, at}: 마지막으로 뷰어로 보낸 URL (이벤트 중복 방지)
    const pdfProbes = new Map(); // url -> Promise<boolean>(진행 중) / boolean(결과), 삽입 순서 LRU 근사
    const tabHost = new Map(); // tabId -> 직전 top-frame 호스트 (PDF 자동 진입용)
    const semaphores = new Map(); // engineId -> semaphore
    let regChain = Promise.resolve();

    // ---- 설정 ----
    async function loadSettings() {
      let stored;
      try {
        const r = await api.storage.sync.get('settings');
        stored = r && r.settings;
      } catch (e) { stored = null; }
      settings = mergeSettings(DEFAULT_SETTINGS, stored);
      settingsJson = JSON.stringify(settings);
      return settings;
    }
    async function getSettings() { return settings || loadSettings(); }

    async function saveSettings(next) {
      settings = next;
      settingsJson = JSON.stringify(next);
      await api.storage.sync.set({ settings: next });
    }

    // ---- 콘텐츠 스크립트 등록 ----
    function registerContentScripts() {
      const run = async () => {
        const s = await getSettings();
        try { await api.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] }); } catch (e) { /* 미등록 */ }
        if (s.enabled === false) return { registered: false };
        const matches = sites.toMatchPatterns(s.sites);
        if (!matches.length) return { registered: false };
        await api.scripting.registerContentScripts([{
          id: SCRIPT_ID, matches, js: s.translateAttrs === true ? CONTENT_JS.slice(0, -1).concat(CONTENT_EXTRA_JS, CONTENT_JS.slice(-1)) : CONTENT_JS, runAt: 'document_idle', allFrames: true,
        }]);
        return { registered: true, matches };
      };
      regChain = regChain.then(run, run);
      return regChain;
    }

    function siteConfigFor(s, host) {
      const sels = [];
      for (const e of s.sites || []) {
        if (e && typeof e === 'object' && e.exclude && sites.hostMatches(host, e.host)) sels.push(String(e.exclude).trim());
      }
      return { exclude: sels.filter(Boolean).join(', ') };
    }

    // ---- 번역 ----
    function modelFor(engine, s) {
      return engine.kind === 'localhost' ? ((s.localhost && s.localhost.model) || '') : '';
    }
    // F23: engine.concurrencyFor(settings)가 있으면 설정 반영(localhost.parallel). 값이 바뀌면 세마포어 재생성.
    function getSemaphore(engine, s) {
      let n = engine.concurrency || 1;
      if (typeof engine.concurrencyFor === 'function') {
        const v = Number(engine.concurrencyFor(s));
        if (Number.isFinite(v) && v >= 1) n = Math.trunc(v);
      }
      const cur = semaphores.get(engine.id);
      if (cur && cur.size === n) return cur.sem;
      const sem = createSemaphore(n);
      semaphores.set(engine.id, { size: n, sem });
      return sem;
    }

    let glossaryFor = null;
    let glossaryNorm = [];
    function glossaryTerms(s) {
      if (glossaryFor !== s.glossary) { glossaryFor = s.glossary; glossaryNorm = glossaryLib.normalize(s.glossary); }
      return glossaryNorm;
    }

    function withDeadline(promise, ms) {
      let t;
      const timeout = new Promise((_, reject) => { t = setTimeout(() => reject({ code: 'timeout', message: 'engine did not respond' }), ms); });
      return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
    }

    async function translateGroup(group, lang, context, s, out, priority) {
      const engine = engines.pickEngine(s, lang);
      out.engine = out.engine || engine.id;
      const model = modelFor(engine, s);
      const misses = [];
      const keys = new Map();
      const terms = glossaryLib ? glossaryTerms(s) : [];
      const sub = new Map(); // id -> {block, applied} (치환이 일어난 블록만)
      for (const b of group) {
        let gkey = '';
        if (terms.length) {
          const r = glossaryLib.applyToItems(b.items, lang, terms);
          if (r.applied.length) {
            sub.set(b.id, { block: Object.assign({}, b, { items: r.items }), applied: r.applied });
            gkey = glossaryLib.appliedKey(r.applied);
          }
        }
        const key = hashLib.cacheKey(engine.id, model + (gkey ? '|g' + gkey : ''), b.items);
        const hit = cache.get(key);
        if (hit) out.results.push({ id: b.id, slots: hit });
        else { keys.set(b.id, key); misses.push(b); }
      }
      const batches = splitBatches(misses, engine.batchLimit);
      const sem = getSemaphore(engine, s);
      await Promise.all(batches.map((batch) => sem.run(async () => {
        try {
          const pairs = new Map();
          const sent = batch.map((b) => {
            const m = sub.get(b.id);
            if (!m) return b;
            for (const p of m.applied) pairs.set(p[0] + '\u0000' + p[1], p);
            return m.block;
          });
          const ctx = pairs.size ? Object.assign({}, context, { glossary: Array.from(pairs.values()) }) : context;
          const map = await withDeadline(engine.translate(sent, ctx, lang, s), d.deadlineMs ? d.deadlineMs(engine, sent.length) : engineDeadlineMs(engine, sent.length) + DEADLINE_SLACK_MS);
          for (const b of batch) {
            const slots = map && map.get(b.id);
            if (!slots || !Object.keys(slots).length) continue;
            cache.set(keys.get(b.id), slots);
            out.results.push({ id: b.id, slots });
          }
        } catch (e) {
          out.errors.push(mapError(e));
        }
      }, priority)));
    }

    async function handleTranslate(msg, sender) {
      const s = await getSettings();
      await cache.ready();
      const tabId = sender && sender.tab && sender.tab.id;
      const blocks = Array.isArray(msg.blocks) ? msg.blocks : [];
      const groups = new Map();
      for (const b of blocks) {
        const lang = toEngineLang(b.lang || msg.lang);
        if (!lang) continue;
        if (!groups.has(lang)) groups.set(lang, []);
        groups.get(lang).push(b);
      }
      const out = { results: [], errors: [], engine: null };
      if (!groups.size) {
        if (!blocks.length) return { ok: true, results: [], engine: null };
        return { ok: false, code: 'unsupported_lang', message: 'unsupported language' };
      }
      await Promise.all(Array.from(groups, async ([lang, group]) => {
        try {
          await translateGroup(group, lang, msg.context || {}, s, out, Number.isFinite(msg.priority) ? msg.priority : 0);
        } catch (e) {
          const m = mapError(e);
          // 엔진 선택 실패(레지스트리가 던짐)는 미지원 언어 외엔 사용 불가로 취급.
          out.errors.push(m.code === 'unknown' ? { code: 'engine_unavailable', message: m.message } : m);
        }
      }));
      const st = tabId != null ? getTab(tabId) : null;
      if (!out.results.length && out.errors.length) {
        const err = out.errors[0];
        if (st) st.lastError = err.code;
        updateBadge(tabId);
        return { ok: false, code: err.code, message: err.message };
      }
      if (st) st.lastError = out.errors.length ? out.errors[0].code : null;
      updateBadge(tabId);
      return { ok: true, results: out.results, engine: out.engine };
    }

    // ---- 탭 상태·배지 ----
    function getTab(tabId) {
      if (!tabState.has(tabId)) tabState.set(tabId, { frames: new Map(), lastError: null });
      return tabState.get(tabId);
    }
    // iframe마다 content가 따로 보고하므로 프레임별로 저장하고 합산한다.
    function pendingOf(st) {
      let n = 0;
      if (st) for (const f of st.frames.values()) n += f.pending;
      return n;
    }
    function resetFrames(tabId, frameId) {
      if (frameId === 0) {
        if (!tabState.has(tabId)) return;
        tabState.delete(tabId);
        updateBadge(tabId);
      } else {
        const st = tabState.get(tabId);
        if (st) st.frames.delete(frameId);
      }
    }
    function updateBadge(tabId) {
      if (tabId == null || !api.action || !api.action.setBadgeText) return;
      const st = tabState.get(tabId);
      const text = st && st.lastError && BADGE_CODES.has(st.lastError) ? '!' : '';
      try {
        const p = api.action.setBadgeText({ text, tabId });
        if (p && p.catch) p.catch(() => {});
      } catch (e) { /* 탭이 이미 닫힘 */ }
    }

    async function resolveTabId(msg, sender) {
      if (sender && sender.tab && sender.tab.id != null) return sender.tab.id;
      if (msg.tabId != null) return msg.tabId;
      try {
        const tabs = await api.tabs.query({ active: true, currentWindow: true });
        if (tabs && tabs[0]) return tabs[0].id;
      } catch (e) { /* ignore */ }
      return null;
    }

    async function handleGetState(msg, sender) {
      const s = await getSettings();
      const url = msg.url || (sender && sender.tab && sender.tab.url) || '';
      const host = hostOfUrl(url);
      const tabId = await resolveTabId(msg, sender);
      const st = tabId != null ? tabState.get(tabId) : null;
      const eng = s.engine || {};
      const res = {
        siteEnabled: !!host && sites.isSiteEnabled(s, host),
        host,
        engine: (eng.byLang && eng.byLang.en) || eng.default,
        status: st && st.lastError ? 'error' : (pendingOf(st) > 0 ? 'translating' : 'ready'),
        pending: pendingOf(st),
      };
      if (st && st.lastError) res.errorCode = st.lastError;
      return res;
    }

    async function handleSetSiteEnabled(msg) {
      const host = sites.normalizeHost(msg.host);
      if (!host) return { ok: false, code: 'unknown', message: 'invalid host' };
      const s = await getSettings();
      const list = (s.sites || []).map((e) => (e && typeof e === 'object' ? e : { host: e, exclude: '' }))
        .filter((e) => sites.normalizeHost(e.host));
      let next;
      if (msg.enabled) {
        next = list.some((e) => sites.normalizeHost(e.host) === host) ? list : list.concat({ host, exclude: '' });
      } else {
        // 상위 도메인 항목이 호스트를 포함하면 그것도 제거해야 실제로 꺼진다.
        next = list.filter((e) => !sites.hostMatches(host, e.host));
      }
      await saveSettings(Object.assign({}, s, { sites: next }));
      await registerContentScripts();
      return { ok: true };
    }

    function handleReportStatus(msg, sender) {
      const tabId = sender && sender.tab && sender.tab.id;
      if (tabId == null) return undefined;
      const st = getTab(tabId);
      const fid = Number.isFinite(sender.frameId) ? sender.frameId : 0;
      let f = st.frames.get(fid);
      if (!f) st.frames.set(fid, (f = { pending: 0, done: 0, error: 0 }));
      if (Number.isFinite(msg.pending)) f.pending = msg.pending;
      if (Number.isFinite(msg.done)) f.done = msg.done;
      if (Number.isFinite(msg.error)) f.error = msg.error;
      updateBadge(tabId);
      return undefined;
    }

    // ---- PDF ----
    function viewerUrl(src) {
      return api.runtime.getURL('viewer/viewer.html') + '?src=' + encodeURIComponent(src);
    }

    async function handleOpenPdfViewer(msg) {
      let u;
      try { u = new URL(msg.url); } catch (e) { return { ok: false, code: 'unknown', message: 'invalid url' }; }
      if (!['http:', 'https:', 'file:'].includes(u.protocol)) return { ok: false, code: 'unknown', message: 'unsupported scheme' };
      await api.tabs.create({ url: viewerUrl(u.href) });
      return { ok: true };
    }

    // 후보 URL의 Content-Type 확인: HEAD, 실패/비정상 응답이면 Range GET 1회. URL별 결과 캐시. 같은 URL을 사용자가 이미 여는 요청이다.
    async function fetchType(fetchFn, url, init) {
      const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
      let t;
      const timeout = new Promise((_, reject) => { t = setTimeout(() => { if (ctrl) ctrl.abort(); reject(new Error('probe timeout')); }, PDF_PROBE_TIMEOUT_MS); });
      try {
        return await Promise.race([fetchFn(url, Object.assign({ credentials: 'include', redirect: 'follow' }, ctrl ? { signal: ctrl.signal } : {}, init)), timeout]);
      } finally { clearTimeout(t); }
    }
    const isPdfType = (r) => /application\/pdf/i.test(String((r.headers && r.headers.get && r.headers.get('content-type')) || ''));
    async function probePdfUncached(url) {
      const fetchFn = d.fetch || (typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : null);
      if (!fetchFn) return null;
      try {
        const r = await fetchType(fetchFn, url, { method: 'HEAD' });
        if (r && r.ok && r.status !== 405) return isPdfType(r);
      } catch (e) { /* GET 폴백 */ }
      try {
        const r = await fetchType(fetchFn, url, { method: 'GET', headers: { Range: 'bytes=0-0' } });
        if (r && (r.ok || r.status === 206)) return isPdfType(r);
      } catch (e) { /* 판정 불가 */ }
      return null;
    }
    function probePdf(url) {
      if (pdfProbes.has(url)) return Promise.resolve(pdfProbes.get(url));
      const p = probePdfUncached(url).then((v) => {
        // 판정 불가(null)는 캐시하지 않아 다음 이벤트가 다시 시도한다.
        if (v === null) pdfProbes.delete(url); else pdfProbes.set(url, v);
        return v === true;
      });
      pdfProbes.set(url, p);
      while (pdfProbes.size > PDF_CACHE_MAX) pdfProbes.delete(pdfProbes.keys().next().value);
      return p;
    }

    // 같은 탭+URL의 중복 이벤트만 거른다. 시간 창을 두는 이유: 뷰어에서 뒤로 가기로 같은 URL에 다시 올 때는 다시 진입해야 함.
    function recentlyRedirected(tabId, url) {
      const r = pdfRedirected.get(tabId);
      return !!r && r.url === url && Date.now() - r.at < PDF_DEDUPE_MS;
    }

    // 자동 진입 훅: settings.pdfAuto일 때만 동작 (D7). F22: 트리거는 onCommitted(frameId 0)뿐.
    // onBeforeNavigate / tabs.onUpdated는 호스트 기록만 한다(응답 전/커밋 중 탐색 끼어들기가 빈 탭을 만들었음).
    function recordHost(details) {
      if (!details || details.frameId !== 0) return;
      let u;
      try { u = new URL(details.url); } catch (e) { return; }
      const host = hostOfUrl(details.url);
      if (!classifyPdfUrl(u) && host) tabHost.set(details.tabId, host);
    }

    async function onBeforeNavigate(details) {
      recordHost(details);
    }

    async function openViewerInNewTab(tabId, url) {
      let index;
      try {
        const t = await api.tabs.get(tabId);
        if (t && typeof t.index === 'number') index = t.index + 1;
      } catch (e) { console.warn('[kt pdf]', 'tabs.get failed', String(e && e.message || e)); }
      const opts = { url: viewerUrl(url), active: true };
      if (index !== undefined) opts.index = index;
      await api.tabs.create(opts);
      try { await api.tabs.remove(tabId); } catch (e) { console.warn('[kt pdf]', 'tabs.remove failed', String(e && e.message || e)); }
    }

    async function onCommitted(details) {
      if (!details) return;
      resetFrames(details.tabId, details.frameId);
      if (details.frameId !== 0) return;
      const s = await getSettings();
      const host = hostOfUrl(details.url);
      let u;
      try { u = new URL(details.url); } catch (e) { return; }
      const prev = tabHost.get(details.tabId);
      const kind = u.hash === '#kt-original' ? null : classifyPdfUrl(u);
      if (s.pdfAuto === true && kind && /^https?:$/.test(u.protocol)
        && (sites.isSiteEnabled(s, host) || (prev && sites.isSiteEnabled(s, prev)))) {
        if (recentlyRedirected(details.tabId, details.url)) return;
        if (kind === 'pdf' || await probePdf(details.url)) {
          if (recentlyRedirected(details.tabId, details.url)) return;
          pdfRedirected.set(details.tabId, { url: details.url, at: Date.now() });
          try { await openViewerInNewTab(details.tabId, details.url); } catch (e) { console.warn('[kt pdf]', 'open viewer failed', String(e && e.message || e)); }
          return;
        }
      }
      if (!kind && host) tabHost.set(details.tabId, host);
    }

    async function onTabUpdated(tabId, changeInfo) {
      if (!changeInfo || !changeInfo.url) return;
      recordHost({ tabId, url: changeInfo.url, frameId: 0 });
    }

    // ---- 라우터 ----
    async function handleMessage(msg, sender) {
      if (!msg || typeof msg !== 'object') return undefined;
      switch (msg.type) {
        case MSG.TRANSLATE: return handleTranslate(msg, sender);
        case MSG.GET_STATE: return handleGetState(msg, sender);
        case MSG.SET_SITE_ENABLED: return handleSetSiteEnabled(msg);
        case MSG.REPORT_STATUS: return handleReportStatus(msg, sender);
        case MSG.OPEN_PDF_VIEWER: return handleOpenPdfViewer(msg);
        case MSG.CLEAR_CACHE:
          await cache.ready();
          cache.clear();
          await cache.flush();
          return { ok: true };
        case MSG.GET_SITE_CONFIG: {
          const s = await getSettings();
          const host = sites.normalizeHost(msg.host || hostOfUrl((sender && sender.url) || (sender && sender.tab && sender.tab.url)));
          return siteConfigFor(s, host);
        }
        default: return undefined;
      }
    }

    function onMessage(msg, sender, sendResponse) {
      if (!msg || !Object.values(MSG).includes(msg.type)) return false;
      handleMessage(msg, sender).then(sendResponse, (e) => {
        const m = mapError(e);
        sendResponse({ ok: false, code: m.code, message: m.message });
      });
      return true;
    }

    async function onStorageChanged(changes, area) {
      if (area !== 'sync' || !changes || !changes.settings) return;
      const prev = settingsJson;
      await loadSettings();
      if (settingsJson !== prev) await registerContentScripts();
    }

    function start() {
      api.runtime.onMessage.addListener(onMessage);
      api.storage.onChanged.addListener(onStorageChanged);
      if (api.runtime.onInstalled) api.runtime.onInstalled.addListener(() => { registerContentScripts(); });
      if (api.runtime.onStartup) api.runtime.onStartup.addListener(() => { registerContentScripts(); });
      if (api.webNavigation && api.webNavigation.onBeforeNavigate) api.webNavigation.onBeforeNavigate.addListener((det) => { onBeforeNavigate(det).catch(() => {}); });
      if (api.webNavigation && api.webNavigation.onCommitted) api.webNavigation.onCommitted.addListener((det) => { onCommitted(det).catch(() => {}); });
      if (api.tabs && api.tabs.onUpdated) api.tabs.onUpdated.addListener((id, ci) => { onTabUpdated(id, ci).catch(() => {}); });
      if (api.tabs && api.tabs.onRemoved) api.tabs.onRemoved.addListener((id) => { tabState.delete(id); tabHost.delete(id); pdfRedirected.delete(id); });
      return registerContentScripts();
    }

    return {
      start, handleMessage, onMessage, onStorageChanged, onBeforeNavigate, onCommitted, onTabUpdated,
      registerContentScripts, loadSettings, getSettings,
    };
  }

  const exported = { MSG, SCRIPT_ID, CONTENT_JS, CONTENT_EXTRA_JS, DEFAULT_SETTINGS, mergeSettings, toEngineLang, splitBatches, createSemaphore, createBackground };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.background = exported;
  if (typeof module !== 'undefined') module.exports = exported;

  if (typeof globalThis.browser !== 'undefined' && globalThis.browser.runtime && !globalThis.__KT_NO_AUTOSTART__) {
    createBackground({ browser: globalThis.browser }).start();
  }
})();
