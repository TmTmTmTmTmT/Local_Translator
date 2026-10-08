// native 엔진(apple-mt, apple-fm): Safari 확장 Swift 핸들러와 sendNativeMessage로 통신 (PROTOCOL §4).
(function () {
  'use strict';
  const E = () => globalThis.KT.engines;

  const DEFAULT_APP_ID = 'application.id';
  const KNOWN_CODES = new Set(['needs_language_pack', 'engine_unavailable', 'rate_limited', 'bad_response', 'unsupported_lang', 'timeout', 'unknown', 'needs_safari_restart']);
  const CODE_ALIASES = {
    language_pack_missing: 'needs_language_pack',
    model_unavailable: 'engine_unavailable',
    assets_unavailable: 'engine_unavailable',
    unsupported_language: 'unsupported_lang',
  };

  // Swift 에러 {code, message} -> JS 에러. "needs_language_pack:ja" 형태의 접미 언어는 lang 필드로 분리.
  function mapNativeError(err) {
    const raw = err && typeof err === 'object' ? err : { message: typeof err === 'string' ? err : '' };
    let code = String(raw.code || 'unknown');
    let lang = typeof raw.lang === 'string' && raw.lang ? raw.lang : undefined;
    const m = code.match(/^([a-z_]+):(.+)$/);
    if (m) { code = m[1]; lang = lang || m[2]; }
    code = CODE_ALIASES[code] || code;
    if (!KNOWN_CODES.has(code)) code = 'unknown';
    const extra = lang ? { lang } : {};
    return E().makeError(code, (typeof raw.message === 'string' && raw.message) || code, extra);
  }

  // Safari가 옛 플러그인을 붙잡은 경우(재설치 후). ASCII 패턴만 비교한다.
  const STALE_PLUGIN_RE = /No such plugin|Other version in use|uuid not found/i;
  function isStalePluginMessage(msg) { return STALE_PLUGIN_RE.test(String(msg || '')); }

  function baseLang(lang) { return String(lang || '').split('-')[0]; }

  function createNativeEngine(name, opts) {
    const o = opts || {};
    const send = o.send || ((appId, msg) => globalThis.browser.runtime.sendNativeMessage(appId, msg));
    const appId = o.applicationId || DEFAULT_APP_ID;
    const isFm = name === 'apple-fm';
    const langs = ['en', 'ja', 'zh'];

    async function call(msg) {
      try {
        return await send(appId, msg);
      } catch (e) {
        const msg = (e && e.message) || 'native handler unreachable';
        throw E().makeError(isStalePluginMessage(msg) ? 'needs_safari_restart' : 'engine_unavailable', msg);
      }
    }

    return {
      id: `native:${name}`,
      kind: 'native',
      langs,
      batchLimit: isFm ? { chars: 1500, blocks: 8 } : { chars: 6000, blocks: 40 },
      concurrency: isFm ? 1 : 2,
      async translate(blocks, context, lang) {
        if (!langs.includes(baseLang(lang))) throw E().makeError('unsupported_lang', `unsupported lang: ${lang}`);
        const res = await call({ type: 'translate', engine: name, lang, context: context || {}, blocks });
        if (!res || typeof res !== 'object') throw E().makeError('bad_response', 'empty native response');
        if (res.ok === false || res.error) throw mapNativeError(res.error || { code: 'unknown', message: 'native error' });
        if (!Array.isArray(res.results)) throw E().makeError('bad_response', 'missing results');
        const out = new Map();
        for (const r of res.results) {
          if (!r || r.id === undefined || !r.slots || typeof r.slots !== 'object') continue;
          const slots = {};
          for (const [k, v] of Object.entries(r.slots)) if (typeof v === 'string') slots[String(k)] = v;
          out.set(String(r.id), slots);
        }
        return out;
      },
      // lang를 주면 해당 언어팩 설치 여부도 확인.
      async status(lang) {
        let res;
        try { res = await send(appId, { type: 'status' }); } catch (e) {
          return { available: false, reason: isStalePluginMessage(e && e.message) ? 'needs_safari_restart' : 'engine_unavailable' };
        }
        if (!res || res.ok === false) return { available: false, reason: res && res.error ? mapNativeError(res.error).code : 'engine_unavailable' };
        const eng = res.engines && res.engines[name];
        if (eng === false || (eng && typeof eng === 'object' && eng.available === false) || eng === 'unavailable') {
          return { available: false, reason: (eng && eng.reason) || 'engine_unavailable' };
        }
        if (!isFm && lang && res.languagePacks) {
          const st = res.languagePacks[baseLang(lang)];
          if (st === 'unsupported') return { available: false, reason: 'unsupported_lang' };
          if (st === 'supported') return { available: false, reason: 'needs_language_pack', lang: baseLang(lang) };
        }
        return { available: true };
      },
    };
  }

  const api = { createNativeEngine, mapNativeError, isStalePluginMessage, DEFAULT_APP_ID };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.engines = Object.assign(globalThis.KT.engines || {}, api);
  if (typeof module !== 'undefined') module.exports = api;
})();
