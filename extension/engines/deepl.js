// cloud:deepl engine (opt-in, sends page text to DeepL; F24). Key lives only in storage.local (read here, never logged, never sent to content scripts).
(function () {
  'use strict';
  const E = () => globalThis.KT.engines;

  const FREE_URL = 'https://api-free.deepl.com/v2/translate';
  const PRO_URL = 'https://api.deepl.com/v2/translate';
  const KEY_STORAGE = 'deeplKey';
  const KEY_RE = /^[A-Za-z0-9:_-]{8,200}$/;
  const TIMEOUT_MS = 30000;
  const BACKOFF_MS = 1000; // 1 -> 2 -> 4 -> 8 -> 16 s (F25)
  const MAX_RETRIES = 5; // 429/5xx/network
  const MAX_WAIT_MS = 30000; // cap for Retry-After and backoff
  const QUOTA_HOLD_MS = 60000;
  const MIN_INTERVAL_MS = 250; // minimum gap between request starts (F25)
  const MAX_TEXTS = 50;
  const MAX_BYTES = 100 * 1024;
  const SRC_LANG = { en: 'EN', ja: 'JA', zh: 'ZH' };

  const escapeXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const unescapeXml = (s) => String(s)
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, '&');

  // Retry-After header (seconds) -> ms, or 0 when absent/unparseable.
  function retryAfterMs(h) {
    let v = null;
    if (h && typeof h.get === 'function') v = h.get('retry-after');
    else if (h && typeof h === 'object') v = h['retry-after'] != null ? h['retry-after'] : h['Retry-After'];
    const n = Number(v);
    return v != null && v !== '' && Number.isFinite(n) && n >= 0 ? Math.min(n * 1000, MAX_WAIT_MS) : 0;
  }
  const backoffMs = (attempt, retryAfter) => Math.min(retryAfter > 0 ? retryAfter : BACKOFF_MS * 2 ** attempt, MAX_WAIT_MS);

  const endpointFor = (key) => (/:fx$/.test(key) ? FREE_URL : PRO_URL);

  // Segments (consecutive t items) with the gap index (number of x items before them) they sit in.
  function segmentsWithGaps(block) {
    const segs = E().planSegments(block);
    const gaps = [];
    let gap = 0;
    let inT = false;
    for (const it of block.items) {
      if (it.k === 't') { if (!inT) { gaps.push(gap); inT = true; } } else { gap++; inT = false; }
    }
    return { segs, gaps, nx: gap };
  }

  // Block -> XML string: segment text escaped, every x item as <x i="n">original</x> (ignore_tags keeps it verbatim).
  function blockToXml(block) {
    let out = '';
    let x = 0;
    let inT = false;
    let seg = 0;
    const { segs } = segmentsWithGaps(block);
    for (const it of block.items) {
      if (it.k === 't') {
        if (!inT) {
          const tx = segs[seg].text;
          // F25: segmenter trims text slots, so restore a separating space after an x item ("points" + "by").
          out += (x > 0 && out && !/\s$/.test(out) && !/^[\s,.;:!?)\]}]/.test(tx) ? ' ' : '') + escapeXml(tx);
          seg++; inT = true;
        }
      } else {
        const sp = inT && !/\s$/.test(out) && !/[(\[{]$/.test(out) ? ' ' : '';
        out += `${sp}<x i="${x}">${escapeXml(it.text || '')}</x>`;
        x++;
        inT = false;
      }
    }
    return out;
  }

  const X_TAG_RE = /<x\s+i="(\d+)"\s*(?:\/>|>[\s\S]*?<\/x>)/g;

  // Response XML -> texts per gap (0..nx), or null when x tags differ in count/order from the source.
  function splitByX(xml, nx) {
    const pieces = [];
    const ids = [];
    let last = 0;
    let m;
    X_TAG_RE.lastIndex = 0;
    while ((m = X_TAG_RE.exec(xml))) {
      pieces.push(xml.slice(last, m.index));
      ids.push(Number(m[1]));
      last = m.index + m[0].length;
    }
    pieces.push(xml.slice(last));
    if (ids.length !== nx || ids.some((v, k) => v !== k)) return null;
    // Any leftover markup means the structure is not what we sent.
    if (pieces.some((p) => /<\/?x[\s>\/]/.test(p))) return null;
    return pieces.map(unescapeXml);
  }

  // -> translations aligned with segs (null = missing), or null if the response does not fit the block.
  function mapResponse(block, xml) {
    const { segs, gaps, nx } = segmentsWithGaps(block);
    const pieces = splitByX(xml, nx);
    if (!pieces) return null;
    const used = new Set(gaps);
    for (let g = 0; g <= nx; g++) if (!used.has(g) && pieces[g].trim()) return null; // text moved into a gap that had none
    return segs.map((s, k) => {
      if (!s.translatable) return null;
      const t = pieces[gaps[k]];
      return t && t.trim() ? t : null;
    });
  }

  function chunk(texts) {
    const groups = [];
    let cur = [];
    let bytes = 0;
    for (const t of texts) {
      const n = t.length * 3; // UTF-8 upper bound
      if (cur.length && (cur.length >= MAX_TEXTS || bytes + n > MAX_BYTES)) { groups.push(cur); cur = []; bytes = 0; }
      cur.push(t);
      bytes += n;
    }
    if (cur.length) groups.push(cur);
    return groups;
  }

  function createDeeplEngine(opts) {
    const o = opts || {};
    const br = () => globalThis.browser;
    const getKey = o.getKey || (async () => {
      const b = br();
      const r = b && b.storage && b.storage.local ? await b.storage.local.get(KEY_STORAGE) : null;
      return r && typeof r[KEY_STORAGE] === 'string' ? r[KEY_STORAGE].trim() : '';
    });
    const doFetch = o.fetch || ((...a) => globalThis.fetch(...a));
    const send = o.send || ((id, m) => br().runtime.sendNativeMessage(id, m));
    const appId = o.applicationId || E().DEFAULT_APP_ID || 'application.id';
    const sleep = o.sleep || E().sleep;
    const timeoutMs = o.timeoutMs || TIMEOUT_MS;
    const now = o.now || (() => Date.now());
    const minInterval = Number.isFinite(o.minIntervalMs) ? o.minIntervalMs : MIN_INTERVAL_MS;
    let cooldownUntil = 0; // engine-wide: set on 429, every request waits for it
    let nextStartAt = 0; // request start spacing
    let quotaUntil = 0; // after HTTP 456 further requests fail fast for a while (no point hammering)
    let viaNative = false; // after a fetch network failure (Safari CORS), go straight to the native proxy

    async function readKey() {
      const key = String(await getKey() || '').trim();
      if (!key) throw E().makeError('engine_unavailable', 'DeepL API key not set');
      if (!KEY_RE.test(key)) throw E().makeError('engine_unavailable', 'DeepL API key looks invalid');
      return key;
    }

    async function viaFetch(url, key, body) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeoutMs);
      try {
        const res = await doFetch(url, {
          method: 'POST', redirect: 'error', signal: ctrl.signal,
          headers: { 'content-type': 'application/json', authorization: `DeepL-Auth-Key ${key}` }, body,
        });
        return { status: res.status, text: await res.text(), retryAfter: retryAfterMs(res.headers) };
      } catch (e) {
        if (ctrl.signal.aborted) throw E().makeError('timeout', 'request timed out');
        return null; // network/CORS failure -> try native
      } finally { clearTimeout(timer); }
    }

    async function viaNativeHttp(url, key, body) {
      let res;
      try {
        res = await send(appId, { type: 'http', method: 'POST', url, timeoutMs,
          headers: { 'content-type': 'application/json', authorization: `DeepL-Auth-Key ${key}` }, body });
      } catch (e) { throw E().makeError('engine_unavailable', 'DeepL unreachable'); }
      if (!res || typeof res !== 'object') throw E().makeError('engine_unavailable', 'DeepL unreachable');
      if (res.ok === true) return { status: res.status, text: typeof res.body === 'string' ? res.body : '', retryAfter: retryAfterMs(res.headers) };
      const er = res.error || {};
      if (er.code === 'timeout') throw E().makeError('timeout', 'request timed out');
      throw E().makeError('engine_unavailable', 'DeepL unreachable');
    }

    // Wait for the engine-wide cooldown, then reserve a start slot (min spacing between requests).
    async function gate() {
      let wait = cooldownUntil - now();
      if (wait > 0) await sleep(wait);
      const t = Math.max(now(), nextStartAt);
      nextStartAt = t + minInterval;
      wait = t - now();
      if (wait > 0) await sleep(wait);
    }

    async function post(key, payload) {
      const url = endpointFor(key);
      const body = JSON.stringify(payload);
      for (let attempt = 0; ; attempt++) {
        if (quotaUntil > now()) throw E().makeError('rate_limited', 'DeepL monthly quota exceeded', { status: 456 });
        await gate();
        let r = null;
        let netErr = null;
        try {
          if (!viaNative) {
            r = await viaFetch(url, key, body);
            if (!r) viaNative = true;
          }
          if (!r) r = await viaNativeHttp(url, key, body);
        } catch (e) {
          if (e && e.code === 'engine_unavailable' && !e.status) netErr = e; else throw e; // unreachable -> retry; timeout etc. -> throw
        }
        if (netErr) {
          if (attempt < MAX_RETRIES) { cooldownUntil = Math.max(cooldownUntil, now() + backoffMs(attempt, 0)); continue; }
          throw netErr;
        }
        if (r.status >= 200 && r.status < 300) {
          try { return JSON.parse(r.text); } catch (e) { throw E().makeError('bad_response', 'non-JSON response', { status: r.status }); }
        }
        if ((r.status === 429 || r.status >= 500) && attempt < MAX_RETRIES) {
          const w = backoffMs(attempt, r.retryAfter);
          if (r.status === 429) cooldownUntil = Math.max(cooldownUntil, now() + w);
          else await sleep(w);
          continue;
        }
        if (r.status === 401 || r.status === 403) throw E().makeError('engine_unavailable', 'DeepL rejected the API key (check key)', { status: r.status });
        if (r.status === 456) quotaUntil = now() + QUOTA_HOLD_MS;
        if (r.status === 456) throw E().makeError('rate_limited', 'DeepL monthly quota exceeded', { status: 456 });
        if (r.status === 429) throw E().makeError('rate_limited', 'HTTP 429', { status: 429 });
        if (r.status >= 500) throw E().makeError('engine_unavailable', `HTTP ${r.status}`, { status: r.status });
        throw E().makeError('bad_response', `HTTP ${r.status}`, { status: r.status });
      }
    }

    // texts -> {out, err}: out aligned with texts (null where a chunk failed); err = first failure (F25: partial results survive).
    async function translateTexts(key, texts, srcLang, tagged) {
      const out = [];
      let err = null;
      for (const group of chunk(texts)) {
        try {
          const payload = { text: group, target_lang: 'KO', source_lang: srcLang, preserve_formatting: true };
          if (tagged) { payload.tag_handling = 'xml'; payload.ignore_tags = ['x']; }
          const r = await post(key, payload);
          const tr = r && r.translations;
          if (!Array.isArray(tr) || tr.length !== group.length) throw E().makeError('bad_response', 'translations length mismatch');
          for (const t of tr) out.push(t && typeof t.text === 'string' ? t.text : '');
        } catch (e) {
          if (!err) err = e;
          for (let i = 0; i < group.length; i++) out.push(null);
          if (e && (e.code === 'engine_unavailable' || (e.code === 'rate_limited' && e.status === 456))) { // fatal: do not hammer further chunks
            const rest = texts.length - out.length;
            for (let i = 0; i < rest; i++) out.push(null);
            break;
          }
        }
      }
      return { out, err };
    }

    return {
      id: 'cloud:deepl',
      kind: 'cloud',
      langs: ['en', 'ja', 'zh'],
      batchLimit: { chars: 30000, blocks: MAX_TEXTS },
      concurrency: 2,
      mergeBatches: true, // F25: background may combine waiting batches up to batchLimit (fewer requests)
      async translate(blocks, context, lang) {
        const src = SRC_LANG[String(lang || '').split('-')[0]];
        if (!src) throw E().makeError('unsupported_lang', `unsupported lang: ${lang}`);
        const key = await readKey();
        const todo = blocks.filter((b) => E().planSegments(b).some((s) => s.translatable));
        let firstErr = null;
        const r1 = todo.length ? await translateTexts(key, todo.map(blockToXml), src, true) : { out: [], err: null };
        firstErr = r1.err;
        const per = new Map(); // block id -> translations aligned with segments
        const redo = [];
        todo.forEach((b, k) => {
          if (r1.out[k] == null) return; // chunk failed: block stays untranslated (content retries)
          const m = mapResponse(b, r1.out[k]);
          if (m) per.set(b.id, m); else redo.push(b);
        });
        const fb = new Map();
        if (redo.length) { // tag mismatch: re-request per x-delimited segment as plain text
          const plan = E().planBatch(redo);
          const r2 = plan.texts.length ? await translateTexts(key, plan.texts, src, false) : { out: [], err: null };
          if (!firstErr) firstErr = r2.err;
          const res = E().assembleBatch(redo, plan, r2.out);
          for (const b of redo) if (res.has(b.id)) fb.set(b.id, res.get(b.id));
        }
        const result = finish(blocks, per, fb);
        if (!result.size && firstErr) throw firstErr; // nothing succeeded: surface the error
        return result;
      },
      // No network call: availability means a key is stored (nothing is sent to DeepL by a status check).
      async status() {
        try { await readKey(); return { available: true }; } catch (e) { return { available: false, reason: e.code || 'engine_unavailable' }; }
      },
    };
  }

  function finish(blocks, per, fallback) {
    const out = new Map();
    for (const b of blocks) {
      if (fallback.has(b.id)) { out.set(b.id, fallback.get(b.id)); continue; }
      const segs = E().planSegments(b);
      const tr = per.get(b.id) || new Array(segs.length).fill(null);
      const slots = E().assemblePlain(segs, tr);
      if (Object.keys(slots).length) out.set(b.id, slots);
    }
    return out;
  }

  const api = { createDeeplEngine, DEEPL_KEY_STORAGE: KEY_STORAGE, DEEPL_KEY_RE: KEY_RE };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.engines = Object.assign(globalThis.KT.engines || {}, api);
  if (typeof module !== 'undefined') module.exports = api;
})();
