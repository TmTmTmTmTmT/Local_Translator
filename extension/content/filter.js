// 번역 제외 규칙(PLAN §4.2)과 블록 경계 판정. 요소별 WeakMap 캐시로 조상 순회 비용을 상각.
(function () {
  'use strict';

  const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'template', 'svg', 'math', 'canvas', 'iframe', 'object', 'video', 'audio',
    'input', 'textarea', 'select', 'option', 'optgroup']);
  // 링크·코드: 번역하지 않지만 문맥(x 항목)으로는 전달.
  const KEEP_TAGS = new Set(['a', 'pre', 'code', 'kbd', 'samp', 'var', 'tt']);
  const BASE_SELECTOR = '[translate="no"],.notranslate,[contenteditable="true"],[contenteditable=""],[data-kt-ui]';

  const BLOCK_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th', 'dd', 'dt', 'blockquote', 'figcaption',
    'summary', 'caption', 'div', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav', 'ul', 'ol', 'dl', 'table', 'tr',
    'tbody', 'thead', 'tfoot', 'form', 'fieldset', 'figure', 'details', 'address', 'hgroup', 'legend', 'button', 'body', 'html']);

  // selector 문자열별 캐시. 속성이 나중에 바뀌면 resetCache() 필요(동적 translate=no는 범위 외).
  const caches = new Map();
  function cacheFor(sel) {
    let c = caches.get(sel);
    if (!c) { c = new WeakMap(); caches.set(sel, c); }
    return c;
  }
  function resetCache() { caches.clear(); }

  function selectorOf(opts) {
    const extra = opts && typeof opts.excludeSelector === 'string' ? opts.excludeSelector.trim() : '';
    return extra ? BASE_SELECTOR + ',' + extra : BASE_SELECTOR;
  }

  function parentElementOf(el) {
    const p = el.parentNode;
    if (!p) return null;
    if (p.nodeType === 1) return p;
    if (p.nodeType === 11 && p.host) return p.host; // 열린 shadowRoot -> host
    return null;
  }

  function ownReason(el, sel, opts) {
    const tag = el.localName;
    if (SKIP_TAGS.has(tag)) return 'skip';
    let matched = false;
    try { matched = el.matches(sel); } catch (_) {
      try { matched = el.matches(BASE_SELECTOR); } catch (_2) { matched = false; } // 사용자 셀렉터 오류는 무시
    }
    if (matched) return 'skip';
    if (KEEP_TAGS.has(tag)) return 'keep';
    return null;
  }

  // 반환: null(번역 대상) | 'keep'(원문 유지, 문맥 전달) | 'skip'(완전 무시). 가까운 조상 기준이되 skip이 우선.
  function reasonOfElement(el, opts) {
    const sel = selectorOf(opts);
    const cache = cacheFor(sel);
    // 반복 대신 조상 체인을 모아 위에서부터 채움(재귀 깊이 제한 회피).
    const chain = [];
    let cur = el;
    let base = null;
    while (cur) {
      if (cache.has(cur)) { base = cache.get(cur); break; }
      chain.push(cur);
      cur = parentElementOf(cur);
    }
    for (let i = chain.length - 1; i >= 0; i--) {
      const own = ownReason(chain[i], sel, opts);
      let r;
      if (base === 'skip' || own === 'skip') r = 'skip';
      else r = own || base;
      cache.set(chain[i], r);
      base = r;
    }
    return base;
  }

  function exclusionReason(node, opts) {
    if (!node) return 'skip';
    const el = node.nodeType === 1 ? node : parentElementOf(node);
    if (!el) return null;
    return reasonOfElement(el, opts);
  }

  function isExcluded(node, opts) {
    return exclusionReason(node, opts) !== null;
  }

  function isBlockElement(el) { return BLOCK_TAGS.has(el.localName); }

  // 텍스트 노드의 가장 가까운 블록 조상. 없으면 같은 트리의 최상위 요소.
  function blockOf(textNode) {
    let el = textNode.parentNode && textNode.parentNode.nodeType === 1 ? textNode.parentNode : null;
    let last = el;
    while (el) {
      if (BLOCK_TAGS.has(el.localName)) return el;
      last = el;
      const p = el.parentNode;
      el = p && p.nodeType === 1 ? p : null; // shadow 경계에서 멈춤: 트리 간 블록 병합 방지
    }
    return last;
  }

  globalThis.KT = globalThis.KT || {};
  globalThis.KT.filter = { isExcluded, exclusionReason, blockOf, isBlockElement, resetCache, BLOCK_TAGS };
  globalThis.KT.isExcluded = isExcluded;
  globalThis.KT.blockOf = blockOf;
})();
