// LLM 엔진 공통: 시스템 프롬프트(PLAN §4.6, bench/prompt.json과 문구 동일), 사용자 페이로드, 출력 파서/검증.
(function () {
  'use strict';

  const SYSTEM_PROMPT = [
    '\ub2f9\uc2e0\uc740 \uc6f9\ud398\uc774\uc9c0 \ubc88\uc5ed\uac00\uc785\ub2c8\ub2e4. \uc785\ub825\uc73c\ub85c \uc8fc\uc5b4\uc9c4 \uc678\uad6d\uc5b4 \uc6f9\ud398\uc774\uc9c0 \uc870\uac01\uc744 \uc790\uc5f0\uc2a4\ub7ec\uc6b4 \ud55c\uad6d\uc5b4\ub85c \ubc88\uc5ed\ud569\ub2c8\ub2e4.',
    '',
    '[\uaddc\uce59]',
    '1. \uc790\uc5f0\uc2a4\ub7ec\uc6b4 \ud55c\uad6d\uc5b4\ub85c \ubc88\uc5ed\ud569\ub2c8\ub2e4. \uc9c1\uc5ed\ud22c\ub97c \ud53c\ud558\uace0, \uc6d0\ubb38\uc758 \uc5b4\uc870(\uaca9\uc2dd\uccb4/\uad6c\uc5b4\uccb4/\uc720\uba38/\ucee4\ubba4\ub2c8\ud2f0 \ub9d0\ud22c)\ub97c \uc720\uc9c0\ud569\ub2c8\ub2e4.',
    '2. \uc8fc\uc5b4\uc9c4 \ubc94\uc704 \uc804\uccb4\ub97c \uba3c\uc800 \uc77d\uace0, \uc6a9\uc5b4\u00b7\ud638\uce6d\u00b7\ubb38\uccb4\ub97c \uc77c\uad00\ub418\uac8c \uc720\uc9c0\ud569\ub2c8\ub2e4. context.title\uc740 \uae00\uc758 \uc81c\ubaa9\uc774\uba70 \ubc88\uc5ed \ub300\uc0c1\uc774 \uc544\ub2d9\ub2c8\ub2e4.',
    '3. \ud55c \ube14\ub85d\uc758 \uc2ac\ub86f(k="t")\ub4e4\uc740 \ud558\ub098\uc758 \ubb38\uc7a5\uc744 \ucabc\uac20 \uc870\uac01\uc77c \uc218 \uc788\uc2b5\ub2c8\ub2e4. \ud55c\uad6d\uc5b4 \uc5b4\uc21c\uc5d0 \ub9de\uac8c \uc758\ubbf8\ub97c \uc2ac\ub86f\ub4e4 \uc0ac\uc774\uc5d0 \ub2e4\uc2dc \ubc30\ubd84\ud574\ub3c4 \ub429\ub2c8\ub2e4. k="x" \ud56d\ubaa9(\ub9c1\ud06c\u00b7\ucf54\ub4dc \ub4f1)\uc740 \uc704\uce58\uac00 \uace0\uc815\uc774\uba70 \ubc88\uc5ed\u00b7\uc218\uc815\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4. x \uc55e\ub4a4\uc758 \uc870\uc0ac\u00b7\uc5b4\ubbf8\uac00 \uc790\uc5f0\uc2a4\ub7fd\uac8c \uc774\uc5b4\uc9c0\ub3c4\ub85d \uc2ac\ub86f\uc744 \uc791\uc131\ud569\ub2c8\ub2e4. \uc608: [t0 "Click ", x "here", t1 " to continue"] \uc774\uba74 t0="\uacc4\uc18d\ud558\ub824\uba74 ", t1="\uc744(\ub97c) \ud074\ub9ad\ud558\uc138\uc694". \uc2ac\ub86f \uc55e\ub4a4 \uacf5\ubc31\ub3c4 \ubb38\uc7a5\uc774 \uc774\uc5b4\uc9c0\ub3c4\ub85d \ub9de\ucda5\ub2c8\ub2e4.',
    '4. \uace0\uc720\uba85\uc0ac\u00b7\uc81c\ud488\uba85\u00b7\ube0c\ub79c\ub4dc\uba85\u00b7\ucf54\ub4dc\u00b7\ub2e8\uc704\ub294 \uc6d0\ubb38 \uadf8\ub300\ub85c \ub461\ub2c8\ub2e4. \uc22b\uc790\uc640 URL\uc740 \uc808\ub300 \ubc14\uafb8\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.',
    '5. \uc785\ub825\ub41c \ubaa8\ub4e0 \ube14\ub85d\uc758 \ubaa8\ub4e0 \uc2ac\ub86f \ubc88\ud638\ub97c \ube60\uc9d0\uc5c6\uc774 \ubc18\ud658\ud569\ub2c8\ub2e4. \ub0b4\uc6a9\uc774 \uc5c6\uc73c\uba74 \ube48 \ubb38\uc790\uc5f4 "" \uc744 \ubc18\ud658\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. x \ud56d\ubaa9\uc740 \ucd9c\ub825\uc5d0 \ud3ec\ud568\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.',
    '6. x \ud56d\ubaa9 \ubc14\ub85c \ub4a4\uc758 \uc870\uc0ac\ub294 x\uc758 \ub9c8\uc9c0\ub9c9 \uae00\uc790 \ubc1b\uce68\uc5d0 \ub9de\uac8c \uc4f0\uace0, \ubc1b\uce68\uc744 \uc54c \uc218 \uc5c6\uc73c\uba74(\uc601\ubb38\u00b7\uc22b\uc790\ub85c \ub05d\ub098\ub294 \uacbd\uc6b0 \ub4f1) \uc740(\ub294)/\uc774(\uac00)/\uc744(\ub97c)\ucc98\ub7fc \ubcd1\uae30\ud569\ub2c8\ub2e4.',
    '',
    '[\uc785\ub825 \ud615\uc2dd]',
    '{"lang":"\uc6d0\ubb38 \uc5b8\uc5b4","context":{"title":"...","host":"..."},"blocks":[{"id":"\ube14\ub85did","items":[{"k":"t","i":0,"text":"..."},{"k":"x","text":"..."},{"k":"t","i":1,"text":"..."}]}]}',
    '',
    '[\ucd9c\ub825 \ud615\uc2dd]',
    '\uc624\uc9c1 JSON \uac1d\uccb4 \ud558\ub098\ub9cc \ucd9c\ub825\ud569\ub2c8\ub2e4. \uc124\uba85, \uc0dd\uac01 \uacfc\uc815, \ub9c8\ud06c\ub2e4\uc6b4 \ucf54\ub4dc\ud39c\uc2a4\ub294 \ucd9c\ub825\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.',
    '{"blocks":[{"id":"\ube14\ub85did","t":{"0":"\ubc88\uc5ed\ubb38","1":"\ubc88\uc5ed\ubb38"}}]}',
    '\ube14\ub85d id\ub294 \uc785\ub825\uacfc \ub3d9\uc77c\ud574\uc57c \ud558\uace0, t\uc758 \ud0a4\ub294 \uc785\ub825 \uc2ac\ub86f\uc758 i \uac12(\ubb38\uc790\uc5f4)\uc785\ub2c8\ub2e4.',
  ].join('\n');

  const LANG_NOTES = {
    en: '',
    ja: '[\uc77c\ubcf8\uc5b4 \ubcf4\ucda9] \uc77c\ubcf8\uc5b4 \uacbd\uc5b4 \uc218\uc900(\u3067\u3059\u30fb\u307e\u3059 / \u4e01\u5be7\u8a9e / \u656c\u8a9e / \u5e38\u4f53)\uc744 \ud55c\uad6d\uc5b4 \uc874\ub313\ub9d0 \uc218\uc900(\ud569\uc1fc\uccb4\u00b7\ud574\uc694\uccb4\u00b7\ubc18\ub9d0)\uc5d0 \ub300\uc751\uc2dc\ucf1c \ubc88\uc5ed\ud569\ub2c8\ub2e4. \uc778\ud130\ub137 \uc2ac\ub7ad\uacfc \uc904\uc784\ub9d0\uc740 \ud55c\uad6d\uc5b4\uc5d0\uc11c \ube44\uc2b7\ud55c \uc5b4\uac10\uc73c\ub85c \uc62e\uae41\ub2c8\ub2e4.',
    'zh-Hans': '[\uc911\uad6d\uc5b4 \uac04\uccb4 \ubcf4\ucda9] \ud55c\uc790\uc5b4\ub97c \uadf8\ub300\ub85c \uc9c1\uc5ed\ud558\uc9c0 \ub9d0\uace0 \uc790\uc5f0\uc2a4\ub7ec\uc6b4 \ud55c\uad6d\uc5b4 \ud45c\ud604\uc73c\ub85c \ud480\uc5b4 \uc501\ub2c8\ub2e4. \uace0\uc720\uba85\uc0ac(\uc778\uba85\u00b7\uc9c0\uba85\u00b7\uae30\uad00\uba85)\ub294 \ud55c\uad6d\uc5d0\uc11c \ud1b5\uc6a9\ub418\ub294 \ud45c\uae30\ub97c \uc6b0\uc120\ud569\ub2c8\ub2e4.',
    'zh-Hant': '[\uc911\uad6d\uc5b4 \ubc88\uccb4 \ubcf4\ucda9] \ud55c\uc790\uc5b4\ub97c \uadf8\ub300\ub85c \uc9c1\uc5ed\ud558\uc9c0 \ub9d0\uace0 \uc790\uc5f0\uc2a4\ub7ec\uc6b4 \ud55c\uad6d\uc5b4 \ud45c\ud604\uc73c\ub85c \ud480\uc5b4 \uc501\ub2c8\ub2e4. \uace0\uc720\uba85\uc0ac(\uc778\uba85\u00b7\uc9c0\uba85\u00b7\uae30\uad00\uba85)\ub294 \ud55c\uad6d\uc5d0\uc11c \ud1b5\uc6a9\ub418\ub294 \ud45c\uae30\ub97c \uc6b0\uc120\ud569\ub2c8\ub2e4. \ub300\ub9cc\u00b7\ud64d\ucf69\uc2dd \uc6a9\uc5b4\ub294 \ud55c\uad6d\uc5b4 \uc77c\ubc18 \uc6a9\uc5b4\ub85c \uc62e\uae41\ub2c8\ub2e4.',
  };
  LANG_NOTES.zh = LANG_NOTES['zh-Hans'];

  function buildSystemPrompt(lang) {
    const note = LANG_NOTES[lang];
    return note ? `${SYSTEM_PROMPT}\n\n${note}` : SYSTEM_PROMPT;
  }

  function buildUserPayload(lang, context, blocks) {
    return {
      lang,
      context: { title: (context && context.title) || '', host: (context && context.host) || '' },
      blocks: blocks.map((b) => ({
        id: b.id,
        items: b.items.map((it) => (it.k === 't' ? { k: 't', i: it.i, text: it.text } : { k: 'x', text: it.text })),
      })),
    };
  }

  // 용어집 힌트(lib/glossary.js hintFor와 문구 동일). pairs = [[src,dst],...]; 비었으면 ''.
  function glossaryHint(pairs) {
    if (!Array.isArray(pairs)) return '';
    const ok = pairs.filter((p) => Array.isArray(p) && typeof p[0] === 'string' && typeof p[1] === 'string');
    return ok.length ? '\uc6a9\uc5b4\uc9d1(\ubc18\ub4dc\uc2dc \uc9c0\ud0ac \uac83): ' + ok.map((p) => `${p[0]} \u2192 ${p[1]}`).join('; ') : '';
  }

  // userSuffix: qwen3 계열의 "/no_think" 등.
  function buildMessages({ lang, context, blocks, userSuffix }) {
    const user = JSON.stringify(buildUserPayload(lang, context, blocks)) + (userSuffix ? `\n${userSuffix}` : '');
    const hint = glossaryHint(context && context.glossary);
    return [
      { role: 'system', content: hint ? `${buildSystemPrompt(lang)}\n\n${hint}` : buildSystemPrompt(lang) },
      { role: 'user', content: user },
    ];
  }

  // ---- 출력 파서 ----

  function stripThink(text) {
    let s = String(text == null ? '' : text).replace(/<think>[\s\S]*?<\/think>/gi, '');
    const close = s.search(/<\/think>/i); // <think> 프리필 템플릿은 닫는 태그만 나온다
    if (close >= 0) s = s.slice(close + '</think>'.length);
    return s.replace(/<\/?think>/gi, '');
  }

  // 문자열 인식 수선: 문자열 내 제어문자 이스케이프, 후행 쉼표 제거, 잘린 출력 닫기.
  function repairJson(src) {
    const out = [];
    const stack = [];
    let inStr = false, esc = false;
    const lastSig = () => { for (let i = out.length - 1; i >= 0; i--) if (!/\s/.test(out[i])) return i; return -1; };
    for (const ch of src) {
      if (inStr) {
        if (esc) { out.push(ch); esc = false; continue; }
        if (ch === '\\') { out.push(ch); esc = true; continue; }
        if (ch === '"') { out.push(ch); inStr = false; continue; }
        if (ch === '\n') { out.push('\\n'); continue; }
        if (ch === '\r') { out.push('\\r'); continue; }
        if (ch === '\t') { out.push('\\t'); continue; }
        out.push(ch);
        continue;
      }
      if (ch === '"') { inStr = true; out.push(ch); continue; }
      if (ch === '{' || ch === '[') { stack.push(ch === '{' ? '}' : ']'); out.push(ch); continue; }
      if (ch === '}' || ch === ']') {
        const i = lastSig();
        if (i >= 0 && out[i] === ',') out.splice(i, 1);
        if (stack.length && stack[stack.length - 1] === ch) stack.pop();
        out.push(ch);
        continue;
      }
      out.push(ch);
    }
    if (inStr) { if (esc) out.pop(); out.push('"'); }
    let i = lastSig();
    while (i >= 0 && out[i] === ',') { out.splice(i, 1); i = lastSig(); }
    if (i >= 0 && out[i] === ':') out.push('null');
    while (stack.length) out.push(stack.pop());
    return out.join('');
  }

  function balancedFrom(s, start) {
    let depth = 0, inStr = false, esc = false;
    for (let i = start; i < s.length; i++) {
      const ch = s[i];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === '\\') esc = true;
        else if (ch === '"') inStr = false;
        continue;
      }
      if (ch === '"') inStr = true;
      else if (ch === '{' || ch === '[') depth++;
      else if (ch === '}' || ch === ']') { depth--; if (depth === 0) return s.slice(start, i + 1); }
    }
    return s.slice(start); // 잘린 출력
  }

  function tryParse(c) {
    try { return JSON.parse(c); } catch (e) { /* fallthrough */ }
    try { return JSON.parse(repairJson(c)); } catch (e) { return null; }
  }

  const isContainer = (v) => v !== null && typeof v === 'object';

  function extractJson(text) {
    const s = stripThink(text).replace(/^\ufeff/, '');
    const cands = [];
    for (const m of s.matchAll(/```(?:json|JSON)?[ \t]*\r?\n?([\s\S]*?)```/g)) cands.push(m[1]);
    const open = s.match(/```(?:json|JSON)?[ \t]*\r?\n?([\s\S]*)$/);
    if (open) cands.push(open[1]);
    cands.push(s);
    for (const c of cands) {
      const whole = tryParse(c.trim());
      if (isContainer(whole)) return whole;
      for (const re of [/\{/g, /\[/g]) {
        let n = 0;
        for (const m of c.matchAll(re)) {
          if (n++ >= 20) break;
          const v = tryParse(balancedFrom(c, m.index));
          if (isContainer(v)) return v;
        }
      }
    }
    return null;
  }

  function normalizeSlots(t) {
    const slots = {};
    const put = (k, v) => {
      if (typeof v === 'number') v = String(v);
      if (typeof v === 'string') slots[String(k)] = v;
    };
    if (Array.isArray(t)) {
      t.forEach((v, idx) => {
        if (isContainer(v)) put(v.i !== undefined ? v.i : (v.id !== undefined ? v.id : idx), v.text !== undefined ? v.text : (v.t !== undefined ? v.t : v.translation));
        else put(idx, v);
      });
    } else if (isContainer(t)) {
      for (const [k, v] of Object.entries(t)) put(k.replace(/^t/i, ''), v);
    }
    return slots;
  }

  function findEntries(value) {
    if (Array.isArray(value)) return value;
    if (!isContainer(value)) return null;
    const b = value.blocks !== undefined ? value.blocks : (value.translations !== undefined ? value.translations : value.result);
    if (Array.isArray(b)) return b;
    if (isContainer(b)) return Object.entries(b).map(([id, v]) => (isContainer(v) && !Array.isArray(v) ? Object.assign({ id }, v) : { id, t: v }));
    const vals = Object.entries(value);
    if (vals.length && vals.every(([, v]) => isContainer(v))) {
      return vals.map(([id, v]) => (Array.isArray(v) ? { id, t: v } : Object.assign({ id }, v)));
    }
    return null;
  }

  // 모델 출력 -> Map<blockId, {slotIdx: text}>. 파싱 불가/구조 불명이면 null. 잘린 출력은 있는 만큼 반환.
  function parseLlmOutput(text) {
    const value = extractJson(text);
    if (value === null) return null;
    const entries = findEntries(value);
    if (!entries) return null;
    const map = new Map();
    for (const e of entries) {
      if (!isContainer(e) || e.id === undefined || e.id === null) continue;
      const t = e.t !== undefined ? e.t : (e.slots !== undefined ? e.slots : (e.translations !== undefined ? e.translations : e.items));
      map.set(String(e.id), normalizeSlots(t));
    }
    return map;
  }

  // 블록의 기대 슬롯만 남긴다. missing = 응답에 없는 슬롯 i 목록 (누락 슬롯은 원문 유지, 절반 이상 누락 판정은 호출자).
  function validateSlots(block, map) {
    const expected = block.items.filter((it) => it.k === 't').map((it) => String(it.i));
    const got = (map && map.get ? map.get(block.id) : null) || {};
    const slots = {};
    const missing = [];
    for (const k of expected) {
      if (typeof got[k] === 'string') slots[k] = got[k];
      else missing.push(k);
    }
    return { slots, missing, complete: missing.length === 0, present: block.id != null && !!(map && map.has && map.has(block.id)) };
  }

  const api = { SYSTEM_PROMPT, LANG_NOTES, buildSystemPrompt, buildUserPayload, buildMessages, glossaryHint, stripThink, repairJson, extractJson, parseLlmOutput, validateSlots };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.engines = Object.assign(globalThis.KT.engines || {}, api);
  if (typeof module !== 'undefined') module.exports = api;
})();
