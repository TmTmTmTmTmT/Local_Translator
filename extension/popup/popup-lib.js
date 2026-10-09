// Pure view-model builder for the popup so rendering state is testable without a browser.
(function (root) {
  const ERRORS = {
    needs_language_pack: '컨테이너 앱에서 언어팩을 설치하세요',
    engine_unavailable: '번역 엔진을 사용할 수 없습니다. 옵션에서 엔진과 서버를 확인하세요',
    needs_safari_restart: '확장이 업데이트되었습니다. Safari를 완전히 종료(⌘Q)했다가 다시 여세요.',
    rate_limited: '요청 제한(잠시 후 재시도)',
    bad_response: '엔진 응답 오류(잠시 후 재시도)',
    unsupported_lang: '지원하지 않는 언어입니다',
    timeout: '응답 시간 초과(잠시 후 재시도)',
    unknown: '알 수 없는 오류가 발생했습니다',
  };

  function looksLikePdf(url) {
    if (!url) return false;
    try {
      return /\.pdf$/i.test(new URL(url).pathname);
    } catch (e) {
      return /\.pdf($|[?#])/i.test(String(url));
    }
  }

  function hostOf(url) {
    try {
      const u = new URL(url);
      return /^https?:$/.test(u.protocol) ? u.hostname : '';
    } catch (e) {
      return '';
    }
  }

  // state: getState response (may be null); ctx: {url, debug, mode}
  function buildViewModel(state, ctx) {
    const s = state || {};
    const c = ctx || {};
    const host = s.host || hostOf(c.url);
    const pdf = looksLikePdf(c.url);
    const code = s.errorCode || '';
    let errorMessage = '';
    if (code) errorMessage = ERRORS[code] || ERRORS.unknown;
    else if (!state) errorMessage = '확장 상태를 가져오지 못했습니다';
    const status = s.status || (state ? 'ready' : 'unknown');
    const engine = s.engine || '-';
    const pending = Number.isFinite(s.pending) ? s.pending : 0;
    const translating = status === 'translating' && pending > 0 && !code;
    return {
      host,
      hasHost: !!host,
      siteEnabled: !!s.siteEnabled,
      engineLine: `${engine} · ${status}`,
      errorMessage,
      hasError: !!errorMessage,
      pdfLooksLikePdf: pdf,
      pdfEnabled: !!c.url,
      pdfHint: pdf ? '' : 'PDF가 아닌 페이지에서도 시도할 수 있습니다',
      pendingVisible: !!c.debug || translating,
      pendingText: translating ? `번역 중… (남은 ${pending}블록)` : `번역 대기 ${pending}블록`,
      toggleLabel: c.mode === 'original' ? '번역 보기' : '원문 보기',
    };
  }

  function render(doc, vm) {
    const set = (id, fn) => { const el = doc.getElementById(id); if (el) fn(el); };
    set('host', (el) => { el.textContent = vm.host || '(지원하지 않는 페이지)'; });
    set('site-toggle', (el) => { el.checked = vm.siteEnabled; el.disabled = !vm.hasHost; });
    set('toggle-original', (el) => { el.textContent = vm.toggleLabel; el.disabled = !vm.hasHost; });
    set('engine', (el) => { el.textContent = vm.engineLine; });
    set('error', (el) => { el.textContent = vm.errorMessage; el.hidden = !vm.hasError; });
    set('pdf', (el) => { el.disabled = !vm.pdfEnabled; el.title = vm.pdfHint; });
    set('pending', (el) => { el.textContent = vm.pendingText; el.hidden = !vm.pendingVisible; });
  }

  function modeOf(res) {
    return res && res.mode === 'original' ? 'original' : 'translated';
  }

  const api = { ERRORS, looksLikePdf, hostOf, buildViewModel, render, modeOf };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.KTPopup = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
