// Pure helpers for the options page: defaults, site/exclude parsing, loopback validation.
(function (root) {
  const ENGINES = [
    { id: 'native:apple-mt', label: 'Apple 번역 (시스템)' },
    { id: 'native:apple-fm', label: 'Apple Intelligence (온디바이스)' },
    { id: 'local:ollama', label: 'Ollama (localhost)' },
    { id: 'local:mlx', label: 'MLX 서버 (localhost)' },
    { id: 'local:mt-ollama', label: 'MT 모드 Ollama (번역 특화 모델, localhost)' },
    { id: 'local:mt-mlx', label: 'MT 모드 MLX (번역 특화 모델, localhost)' },
    { id: 'local:ct2', label: 'CTranslate2 MT 서버 (localhost)' },
  ];
  const KINDS = ['ollama', 'mlx', 'ct2'];
  const FAMILIES = ['hymt2', 'translategemma', 'chat'];
  const DEFAULT_KEEP_ALIVE = 300;
  // 고품질 프리셋 (D1 평가 1위, PLAN §11.1). 저장은 사용자가 직접 누른다.
  const PRESET_TRANSLATEGEMMA = {
    engine: 'local:mt-ollama',
    localhost: { baseUrl: 'http://127.0.0.1:11434', kind: 'ollama', model: 'translategemma:4b', family: 'translategemma', keepAlive: DEFAULT_KEEP_ALIVE },
  };
  const HOST_RE = /^(?=.{1,253}$)[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/;

  function defaults() {
    return {
      sites: [],
      engine: { default: 'native:apple-mt', byLang: { ja: null, zh: null } },
      localhost: { baseUrl: 'http://127.0.0.1:11434', kind: 'ollama', model: '', family: 'hymt2', keepAlive: DEFAULT_KEEP_ALIVE },
      enabled: true,
      translateAttrs: false,
      fixParticles: true,
      glossary: [],
    };
  }

  function mergeSettings(stored) {
    const d = defaults();
    const s = stored && typeof stored === 'object' ? stored : {};
    const engineIds = ENGINES.map((e) => e.id);
    const eng = s.engine && typeof s.engine === 'object' ? s.engine : {};
    const by = eng.byLang && typeof eng.byLang === 'object' ? eng.byLang : {};
    const pick = (v) => (engineIds.includes(v) ? v : null);
    const lh = s.localhost && typeof s.localhost === 'object' ? s.localhost : {};
    return {
      sites: Array.isArray(s.sites)
        ? s.sites
            .filter((x) => x && typeof x.host === 'string' && x.host)
            .map((x) => ({ host: x.host, exclude: typeof x.exclude === 'string' ? x.exclude : '' }))
        : d.sites,
      engine: {
        default: pick(eng.default) || d.engine.default,
        byLang: { ja: pick(by.ja), zh: pick(by.zh) },
      },
      localhost: {
        baseUrl: typeof lh.baseUrl === 'string' && lh.baseUrl ? lh.baseUrl : d.localhost.baseUrl,
        kind: KINDS.includes(lh.kind) ? lh.kind : d.localhost.kind,
        model: typeof lh.model === 'string' ? lh.model : '',
        family: FAMILIES.includes(lh.family) ? lh.family : d.localhost.family,
        keepAlive: Number.isFinite(lh.keepAlive) && lh.keepAlive >= -1 ? Math.trunc(lh.keepAlive) : d.localhost.keepAlive,
      },
      enabled: typeof s.enabled === 'boolean' ? s.enabled : true,
      translateAttrs: typeof s.translateAttrs === 'boolean' ? s.translateAttrs : d.translateAttrs,
      fixParticles: typeof s.fixParticles === 'boolean' ? s.fixParticles : d.fixParticles,
      glossary: Array.isArray(s.glossary) ? s.glossary : d.glossary,
    };
  }

  function normalizeHost(line) {
    return line.trim().toLowerCase().replace(/^\*\./, '').replace(/\.$/, '');
  }

  function isValidHost(h) {
    return HOST_RE.test(h);
  }

  // Returns {hosts, errors}; duplicates are dropped silently.
  function parseSitesText(text) {
    const hosts = [];
    const errors = [];
    String(text || '').split(/\r?\n/).forEach((raw, idx) => {
      const line = raw.trim();
      if (!line || line.startsWith('#')) return;
      const h = normalizeHost(line);
      if (!isValidHost(h)) {
        errors.push({ line: idx + 1, message: `잘못된 호스트: ${line}` });
        return;
      }
      if (!hosts.includes(h)) hosts.push(h);
    });
    return { hosts, errors };
  }

  // 'host | css selector' lines -> {map: {host: "sel1, sel2"}, errors}. validate(selector) -> boolean is optional.
  function parseExcludeText(text, validate) {
    const map = {};
    const errors = [];
    String(text || '').split(/\r?\n/).forEach((raw, idx) => {
      const line = raw.trim();
      if (!line || line.startsWith('#')) return;
      const p = line.indexOf('|');
      if (p < 0) {
        errors.push({ line: idx + 1, message: `형식: host | selector (${line})` });
        return;
      }
      const host = normalizeHost(line.slice(0, p));
      const sel = line.slice(p + 1).trim();
      if (!isValidHost(host)) {
        errors.push({ line: idx + 1, message: `잘못된 호스트: ${host}` });
        return;
      }
      if (!sel || (validate && !validate(sel))) {
        errors.push({ line: idx + 1, message: `잘못된 셀렉터: ${sel}` });
        return;
      }
      map[host] = map[host] ? `${map[host]}, ${sel}` : sel;
    });
    return { map, errors };
  }

  function buildSites(sitesText, excludeText, validate) {
    const a = parseSitesText(sitesText);
    const b = parseExcludeText(excludeText, validate);
    const errors = a.errors.concat(b.errors);
    for (const h of Object.keys(b.map)) {
      if (!a.hosts.includes(h)) errors.push({ line: 0, message: `제외 규칙의 호스트가 사이트 목록에 없음: ${h}` });
    }
    return { sites: a.hosts.map((host) => ({ host, exclude: b.map[host] || '' })), errors };
  }

  function sitesToText(sites) {
    return (sites || []).map((s) => s.host).join('\n');
  }

  // One line per host; multiple selectors stay joined in one line.
  function excludesToText(sites) {
    return (sites || []).filter((s) => s.exclude).map((s) => `${s.host} | ${s.exclude}`).join('\n');
  }

  function isLoopbackUrl(value) {
    let u;
    try {
      u = new URL(String(value).trim());
    } catch (e) {
      return false;
    }
    if (u.protocol !== 'http:') return false;
    if (u.username || u.password) return false;
    return u.hostname === '127.0.0.1' || u.hostname === 'localhost' || u.hostname === '[::1]';
  }

  // 용어집 텍스트: 한 줄에 `원문 => 번역`. 기존 항목의 lang/case는 같은 원문이면 유지한다.
  const MAX_GLOSSARY = 500;
  const MAX_SRC = 80;
  function parseGlossaryText(text, prev) {
    const old = new Map();
    for (const t of Array.isArray(prev) ? prev : []) if (t && typeof t.src === 'string') old.set(t.src.toLowerCase(), t);
    const terms = [];
    const errors = [];
    const seen = new Set();
    String(text || '').split(/\r?\n/).forEach((raw, idx) => {
      const line = raw.trim();
      if (!line || line.startsWith('#')) return;
      const at = line.indexOf('=>');
      if (at < 0) { errors.push({ line: idx + 1, message: '`원문 => 번역` 형식이어야 합니다' }); return; }
      const src = line.slice(0, at).trim();
      const dst = line.slice(at + 2).trim();
      if (!src || !dst) { errors.push({ line: idx + 1, message: '원문과 번역이 모두 필요합니다' }); return; }
      if (src.length > MAX_SRC) { errors.push({ line: idx + 1, message: `원문은 ${MAX_SRC}자 이하여야 합니다` }); return; }
      const key = src.toLowerCase();
      if (seen.has(key)) { errors.push({ line: idx + 1, message: '중복된 원문입니다' }); return; }
      seen.add(key);
      const o = old.get(key);
      const term = { src, dst };
      if (o && typeof o.lang === 'string' && o.lang) term.lang = o.lang;
      if (o && o.case === true) term.case = true;
      terms.push(term);
    });
    if (terms.length > MAX_GLOSSARY) errors.push({ line: 0, message: `용어는 최대 ${MAX_GLOSSARY}개입니다` });
    return { terms: terms.slice(0, MAX_GLOSSARY), errors };
  }

  function glossaryToText(list) {
    return (Array.isArray(list) ? list : [])
      .filter((t) => t && typeof t.src === 'string' && typeof t.dst === 'string')
      .map((t) => `${t.src} => ${t.dst}`)
      .join('\n');
  }

  function validateLocalhost(lh) {
    const errors = [];
    if (!isLoopbackUrl(lh.baseUrl)) errors.push('baseUrl은 http://127.0.0.1 또는 localhost 만 허용됩니다');
    if (!KINDS.includes(lh.kind)) errors.push('kind는 ollama, mlx, ct2 중 하나여야 합니다');
    if (lh.family !== undefined && !FAMILIES.includes(lh.family)) errors.push('family는 hymt2, translategemma, chat 중 하나여야 합니다');
    if (lh.keepAlive !== undefined && !(Number.isFinite(lh.keepAlive) && lh.keepAlive >= -1)) errors.push('keep-alive는 -1 이상의 초 단위 숫자여야 합니다');
    return errors;
  }

  const api = { ENGINES, KINDS, FAMILIES, PRESET_TRANSLATEGEMMA, parseGlossaryText, glossaryToText, defaults, mergeSettings, parseSitesText, parseExcludeText, buildSites, sitesToText, excludesToText, isLoopbackUrl, validateLocalhost, isValidHost };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.KTOptions = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
