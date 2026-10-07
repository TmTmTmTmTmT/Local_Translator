// 번역 제외 규칙(PLAN §4.2)과 블록 경계 판정. 요소별 WeakMap 캐시로 조상 순회 비용을 상각.
(function () {
  'use strict';

  const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'template', 'svg', 'math', 'canvas', 'iframe', 'object', 'video', 'audio',
    'input', 'textarea', 'select', 'option', 'optgroup']);
  // 링크·코드: 번역하지 않지만 문맥(x 항목)으로는 전달. role=code도 같이 취급.
  const KEEP_TAGS = new Set(['a', 'pre', 'code', 'kbd', 'samp', 'var', 'tt']);
  const BASE_SELECTOR = '[translate="no"],.notranslate,[contenteditable="true"],[contenteditable=""],[data-kt-ui]';
  const BLOCK_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th', 'dd', 'dt', 'blockquote', 'figcaption',
    'summary', 'caption', 'div', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav', 'ul', 'ol', 'dl', 'table', 'tr',
    'tbody', 'thead', 'tfoot', 'form', 'fieldset', 'figure', 'details', 'address', 'hgroup', 'legend', 'button', 'body', 'html']);

  // selector 문자열별 캐시. 속성이 나중에 바뀌어도 갱신하지 않는다(동적 translate=no는 범위 외).
  const caches = new Map();

  // 열린 shadowRoot는 host로 이어진다.
  function parentElementOf(el) {
    const p = el.parentNode;
    return !p ? null : p.nodeType === 1 ? p : p.nodeType === 11 && p.host ? p.host : null;
  }

  function ownReason(el, sel) {
    const tag = el.localName;
    if (SKIP_TAGS.has(tag)) return 'skip';
    let matched = false;
    try { matched = el.matches(sel); } catch (_) { matched = el.matches(BASE_SELECTOR); } // 사용자 셀렉터 오류는 무시
    return matched ? 'skip' : KEEP_TAGS.has(tag) || el.matches('[role="code"]') ? 'keep' : null;
  }

  // 반환: null(번역 대상) | 'keep'(원문 유지, 문맥 전달) | 'skip'(완전 무시). 가까운 조상 기준이되 skip이 우선.
  function reasonOfElement(el, opts) {
    const extra = opts && typeof opts.excludeSelector === 'string' ? opts.excludeSelector.trim() : '';
    const sel = extra ? BASE_SELECTOR + ',' + extra : BASE_SELECTOR;
    let cache = caches.get(sel);
    if (!cache) caches.set(sel, (cache = new WeakMap()));
    // 재귀 대신 조상 체인을 모아 위에서부터 채움(깊이 제한 회피).
    const chain = [];
    let base = null;
    for (let cur = el; cur; cur = parentElementOf(cur)) {
      if (cache.has(cur)) { base = cache.get(cur); break; }
      chain.push(cur);
    }
    for (let i = chain.length - 1; i >= 0; i--) {
      const own = ownReason(chain[i], sel);
      base = base === 'skip' || own === 'skip' ? 'skip' : own || base;
      cache.set(chain[i], base);
    }
    return base;
  }

  function exclusionReason(node, opts) {
    if (!node) return 'skip';
    const el = node.nodeType === 1 ? node : parentElementOf(node);
    return el ? reasonOfElement(el, opts) : null;
  }

  function isExcluded(node, opts) { return exclusionReason(node, opts) !== null; }

  // 텍스트 노드의 가장 가까운 블록 조상. 없으면 같은 트리의 최상위 요소. shadow 경계에서 멈춰 트리 간 블록 병합을 막는다.
  function blockOf(textNode) {
    let el = textNode.parentNode && textNode.parentNode.nodeType === 1 ? textNode.parentNode : null;
    let last = el;
    while (el) {
      if (BLOCK_TAGS.has(el.localName)) return el;
      last = el;
      el = el.parentNode && el.parentNode.nodeType === 1 ? el.parentNode : null;
    }
    return last;
  }

  (globalThis.KT = globalThis.KT || {}).filter = { isExcluded, exclusionReason, blockOf };
})();
