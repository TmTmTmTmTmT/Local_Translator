// Options page controller: loads/saves `settings` in storage.sync (PROTOCOL §1).
(function () {
  const api = typeof browser !== 'undefined' ? browser : chrome;
  const lib = globalThis.KTOptions;
  const $ = (id) => document.getElementById(id);

  function fillEngines(select, withInherit) {
    select.textContent = '';
    if (withInherit) {
      const o = document.createElement('option');
      o.value = '';
      o.textContent = '(기본 엔진 사용)';
      select.appendChild(o);
    }
    for (const e of lib.ENGINES) {
      const o = document.createElement('option');
      o.value = e.id;
      o.textContent = e.label;
      select.appendChild(o);
    }
  }

  function validSelector(sel) {
    try {
      document.createDocumentFragment().querySelector(sel);
      return true;
    } catch (e) {
      return false;
    }
  }

  function setFeedback(msg, ok) {
    const el = $('feedback');
    el.textContent = msg;
    el.className = ok ? 'ok' : 'err';
  }

  function showErrors(list) {
    const ul = $('errors');
    ul.textContent = '';
    for (const m of list) {
      const li = document.createElement('li');
      li.textContent = m;
      ul.appendChild(li);
    }
  }

  function populate(s) {
    $('engine-default').value = s.engine.default;
    $('engine-ja').value = s.engine.byLang.ja || '';
    $('engine-zh').value = s.engine.byLang.zh || '';
    $('lh-kind').value = s.localhost.kind;
    $('lh-base').value = s.localhost.baseUrl;
    $('lh-model').value = s.localhost.model;
    $('lh-family').value = s.localhost.family;
    $('lh-keepalive').value = String(s.localhost.keepAlive);
    $('translate-attrs').checked = s.translateAttrs;
    $('fix-particles').checked = s.fixParticles;
    $('link-standalone').checked = s.linkMode !== 'never';
    $('glossary').value = lib.glossaryToText(s.glossary);
    $('sites').value = lib.sitesToText(s.sites);
    $('excludes').value = lib.excludesToText(s.sites);
  }

  async function load() {
    const got = await api.storage.sync.get('settings');
    populate(lib.mergeSettings(got && got.settings));
  }

  async function save() {
    const stored = (await api.storage.sync.get('settings')).settings || {};
    const current = lib.mergeSettings(stored);
    const built = lib.buildSites($('sites').value, $('excludes').value, validSelector);
    const gl = lib.parseGlossaryText($('glossary').value, current.glossary);
    const localhost = { baseUrl: $('lh-base').value.trim(), kind: $('lh-kind').value, model: $('lh-model').value.trim(),
      family: $('lh-family').value, keepAlive: Number($('lh-keepalive').value === '' ? 300 : $('lh-keepalive').value) };
    const errors = built.errors.concat(gl.errors).map(lib.formatError).concat(lib.validateLocalhost(localhost).map((m) => `Localhost: ${m}`));
    showErrors(errors);
    if (errors.length) {
      setFeedback('저장하지 않았습니다. 오류를 확인하세요', false);
      return;
    }
    const settings = {
      ...stored, // pdfAuto 등 옵션 화면에 없는 키 보존
      sites: built.sites,
      engine: {
        default: $('engine-default').value,
        byLang: { ja: $('engine-ja').value || null, zh: $('engine-zh').value || null },
      },
      localhost,
      enabled: current.enabled,
      translateAttrs: $('translate-attrs').checked,
      fixParticles: $('fix-particles').checked,
      linkMode: $('link-standalone').checked ? 'standalone' : 'never',
      glossary: gl.terms,
    };
    await api.storage.sync.set({ settings });
    setFeedback('저장했습니다', true);
  }

  async function clearCache() {
    try {
      const res = await api.runtime.sendMessage({ type: 'clearCache' });
      setFeedback(res && res.ok ? '캐시를 비웠습니다' : '캐시를 비우지 못했습니다', !!(res && res.ok));
    } catch (e) {
      setFeedback('캐시를 비우지 못했습니다', false);
    }
  }

  fillEngines($('engine-default'), false);
  fillEngines($('engine-ja'), true);
  fillEngines($('engine-zh'), true);
  $('save').addEventListener('click', save);
  $('clear-cache').addEventListener('click', clearCache);
  $('preset-tg').addEventListener('click', () => {
    const p = lib.PRESET_TRANSLATEGEMMA;
    $('engine-default').value = p.engine;
    $('lh-kind').value = p.localhost.kind;
    $('lh-base').value = p.localhost.baseUrl;
    $('lh-model').value = p.localhost.model;
    $('lh-family').value = p.localhost.family;
    $('lh-keepalive').value = String(p.localhost.keepAlive);
    setFeedback('프리셋을 채웠습니다. 저장을 눌러 적용하세요', true);
  });
  load();
})();
