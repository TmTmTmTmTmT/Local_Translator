// 선택 기능(설정 translateAttrs=true일 때만 주입): title/alt/aria-label/placeholder 속성 번역.
// 요소별 속성 1개 = 슬롯 1개짜리 블록. 슬롯의 node는 요소, attr은 속성명.
(function () {
  'use strict';

  const KT = (globalThis.KT = globalThis.KT || {});
  const ATTRS = ['title', 'alt', 'aria-label', 'placeholder'];
  const ATTR_SEL = '[title],[alt],[aria-label],[placeholder]';
  const seen = new WeakMap(); // el -> 이미 등록한 속성명 Set

  function collectAttrs(root, excludeSelector) {
    const T = KT.text, F = KT.filter, opts = { excludeSelector };
    const out = [];
    if (!root || ![1, 9, 11].includes(root.nodeType)) return out;
    const els = Array.from(root.querySelectorAll(ATTR_SEL));
    if (root.nodeType === 1 && root.matches(ATTR_SEL)) els.unshift(root);
    for (const el of els) {
      // input/textarea는 값은 건드리지 않지만 placeholder/title은 대상: 요소 자신의 태그 규칙은 건너뛰고 조상 규칙만 적용.
      const form = el.localName === 'input' || el.localName === 'textarea';
      if (form ? el.closest('[translate="no"],.notranslate') || F.exclusionReason(el.parentNode, opts) !== null
        : F.exclusionReason(el, opts) !== null) continue;
      for (const name of ATTRS) {
        const raw = el.getAttribute(name);
        const txt = raw == null ? '' : T.cleanText(raw);
        if (!txt || T.isNonlinguistic(txt) || T.hangulRatio(txt) >= 0.5 || txt.length > KT.segmenter.MAX_BLOCK_CHARS) continue;
        let s = seen.get(el);
        if (s && s.has(name)) continue;
        const lang = T.detectLang(txt);
        if (lang !== 'en' && lang !== 'ja' && lang !== 'zh') continue;
        if (!s) seen.set(el, (s = new Set()));
        s.add(name);
        const rec = KT.segmenter.newRec(el);
        rec.attr = true;
        rec.lang = rec.block.lang = lang;
        rec.chars = txt.length;
        rec.block.items.push({ k: 't', i: 0, text: txt });
        rec.slots.push({ node: el, attr: name, original: raw });
        out.push(rec);
      }
    }
    return out;
  }

  KT.extra = { collectAttrs };
})();
