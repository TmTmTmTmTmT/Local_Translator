// LLM 엔진 공통: 시스템 프롬프트(PLAN §4.6, bench/prompt.json과 문구 동일), 사용자 페이로드, 출력 파서/검증.
(function () {
  'use strict';

  const SYSTEM_PROMPT = [
    '당신은 웹페이지 번역가입니다. 입력으로 주어진 외국어 웹페이지 조각을 자연스러운 한국어로 번역합니다.',
    '',
    '[규칙]',
    '1. 자연스러운 한국어로 번역합니다. 직역투를 피하고, 원문의 어조(격식체/구어체/유머/커뮤니티 말투)를 유지합니다.',
    '2. 주어진 범위 전체를 먼저 읽고, 용어·호칭·문체를 일관되게 유지합니다. context.title은 글의 제목이며 번역 대상이 아닙니다.',
    '3. 한 블록의 슬롯(k="t")들은 하나의 문장을 쪼갠 조각일 수 있습니다. 한국어 어순에 맞게 의미를 슬롯들 사이에 다시 배분해도 됩니다. k="x" 항목(링크·코드 등)은 위치가 고정이며 번역·수정하지 않습니다. x 앞뒤의 조사·어미가 자연스럽게 이어지도록 슬롯을 작성합니다. 예: [t0 "Click ", x "here", t1 " to continue"] 이면 t0="계속하려면 ", t1="을(를) 클릭하세요". 슬롯 앞뒤 공백도 문장이 이어지도록 맞춥니다.',
    '4. 고유명사·제품명·브랜드명·코드·단위는 원문 그대로 둡니다. 숫자와 URL은 절대 바꾸지 않습니다.',
    '5. 입력된 모든 블록의 모든 슬롯 번호를 빠짐없이 반환합니다. 내용이 없으면 빈 문자열 "" 을 반환할 수 있습니다. x 항목은 출력에 포함하지 않습니다.',
    '6. x 항목 바로 뒤의 조사는 x의 마지막 글자 받침에 맞게 쓰고, 받침을 알 수 없으면(영문·숫자로 끝나는 경우 등) 은(는)/이(가)/을(를)처럼 병기합니다.',
    '',
    '[입력 형식]',
    '{"lang":"원문 언어","context":{"title":"...","host":"..."},"blocks":[{"id":"블록id","items":[{"k":"t","i":0,"text":"..."},{"k":"x","text":"..."},{"k":"t","i":1,"text":"..."}]}]}',
    '',
    '[출력 형식]',
    '오직 JSON 객체 하나만 출력합니다. 설명, 생각 과정, 마크다운 코드펜스는 출력하지 않습니다.',
    '{"blocks":[{"id":"블록id","t":{"0":"번역문","1":"번역문"}}]}',
    '블록 id는 입력과 동일해야 하고, t의 키는 입력 슬롯의 i 값(문자열)입니다.',
  ].join('\n');

  const LANG_NOTES = {
    en: '',
    ja: '[일본어 보충] 일본어 경어 수준(です・ます / 丁寧語 / 敬語 / 常体)을 한국어 존댓말 수준(합쇼체·해요체·반말)에 대응시켜 번역합니다. 인터넷 슬랭과 줄임말은 한국어에서 비슷한 어감으로 옮깁니다.',
    'zh-Hans': '[중국어 간체 보충] 한자어를 그대로 직역하지 말고 자연스러운 한국어 표현으로 풀어 씁니다. 고유명사(인명·지명·기관명)는 한국에서 통용되는 표기를 우선합니다.',
    'zh-Hant': '[중국어 번체 보충] 한자어를 그대로 직역하지 말고 자연스러운 한국어 표현으로 풀어 씁니다. 고유명사(인명·지명·기관명)는 한국에서 통용되는 표기를 우선합니다. 대만·홍콩식 용어는 한국어 일반 용어로 옮깁니다.',
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
    return ok.length ? '용어집(반드시 지킬 것): ' + ok.map((p) => `${p[0]} → ${p[1]}`).join('; ') : '';
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
    const s = stripThink(text).replace(/^﻿/, '');
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
