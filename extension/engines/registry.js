// 엔진 ID -> 엔진 팩토리, 언어별 엔진 선택, 지원 언어 표.
(function () {
  'use strict';
  const E = () => globalThis.KT.engines;

  const ENGINE_META = {
    'native:apple-mt': { kind: 'native', langs: ['en', 'ja', 'zh'], label: 'Apple \ubc88\uc5ed (\uc628\ub514\ubc14\uc774\uc2a4)' },
    'native:apple-fm': { kind: 'native', langs: ['en', 'ja', 'zh'], label: 'Apple Foundation Models (\uc628\ub514\ubc14\uc774\uc2a4)' },
    'local:ollama': { kind: 'localhost', langs: ['en', 'ja', 'zh'], label: 'Ollama (localhost)' },
    'local:mlx': { kind: 'localhost', langs: ['en', 'ja', 'zh'], label: 'MLX \uc11c\ubc84 (localhost)' },
    'local:mt-ollama': { kind: 'localhost', langs: ['en', 'ja', 'zh'], label: 'MT \ubaa8\ub4dc Ollama (localhost)' },
    'local:mt-mlx': { kind: 'localhost', langs: ['en', 'ja', 'zh'], label: 'MT \ubaa8\ub4dc MLX (localhost)' },
    'local:ct2': { kind: 'localhost', langs: ['en', 'ja', 'zh'], label: 'CT2 \ubc88\uc5ed \uc11c\ubc84 (localhost)' },
  };

  const FACTORIES = {
    'native:apple-mt': (o) => E().createNativeEngine('apple-mt', o),
    'native:apple-fm': (o) => E().createNativeEngine('apple-fm', o),
    'local:ollama': (o) => E().createLlmEngine('ollama', o),
    'local:mlx': (o) => E().createLlmEngine('mlx', o),
    'local:mt-ollama': (o) => E().createMtEngine('ollama', o),
    'local:mt-mlx': (o) => E().createMtEngine('mlx', o),
    'local:ct2': (o) => E().createCt2Engine(o),
  };

  const langKey = (lang) => String(lang || '').split('-')[0]; // zh-Hans/zh-Hant -> zh

  function supportsLang(id, lang) {
    const m = ENGINE_META[id];
    return !!m && m.langs.includes(langKey(lang));
  }

  const cache = new Map();
  // opts는 테스트용 주입(fetch/send/sleep). opts 없으면 인스턴스 재사용.
  function getEngine(id, opts) {
    const f = FACTORIES[id];
    if (!f) throw E().makeError('engine_unavailable', `unknown engine: ${id}`);
    if (opts) return f(opts);
    if (!cache.has(id)) cache.set(id, f());
    return cache.get(id);
  }

  // settings.engine.byLang[lang] (null/미지정이면) -> default. 알 수 없는 ID는 default로 대체.
  function pickEngine(settings, lang, opts) {
    const eng = (settings && settings.engine) || {};
    const byLang = eng.byLang || {};
    const key = langKey(lang);
    const want = byLang[key] || byLang[lang] || eng.default || 'native:apple-mt';
    const id = FACTORIES[want] ? want : (FACTORIES[eng.default] ? eng.default : 'native:apple-mt');
    if (!supportsLang(id, lang)) throw E().makeError('unsupported_lang', `${id} does not support ${lang}`);
    return getEngine(id, opts);
  }

  function listEngines() {
    return Object.keys(ENGINE_META).map((id) => Object.assign({ id }, ENGINE_META[id]));
  }

  const api = { ENGINE_META, getEngine, pickEngine, listEngines, supportsLang };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.engines = Object.assign(globalThis.KT.engines || {}, api);
  if (typeof module !== 'undefined') module.exports = api;
})();
