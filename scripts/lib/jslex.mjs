// Minimal JS lexer: splits source into code and comment segments so tools can treat them differently.
// Handles strings, template literals (with nested ${}), regex literals and both comment forms.
// Not a full parser: regex-vs-divide uses the previous significant token, which is enough for this codebase.

const KEYWORDS_BEFORE_REGEX = new Set(['return', 'typeof', 'case', 'in', 'of', 'delete', 'void', 'throw', 'new', 'else', 'do', 'instanceof', 'yield', 'await']);

export function lex(src) {
  const out = [];
  let i = 0;
  let last = ''; // last significant token text (single char for punctuators, word for identifiers)

  function push(type, start, end) { if (end > start) out.push({ type, text: src.slice(start, end) }); }

  function readString(q) {
    let j = i + 1;
    while (j < src.length && src[j] !== q) { if (src[j] === '\\') j++; j++; }
    return j + 1;
  }

  function readRegex() {
    let j = i + 1;
    let inClass = false;
    while (j < src.length) {
      const c = src[j];
      if (c === '\\') { j += 2; continue; }
      if (c === '[') inClass = true;
      else if (c === ']') inClass = false;
      else if (c === '/' && !inClass) break;
      j++;
    }
    j++;
    while (j < src.length && /[a-z]/i.test(src[j])) j++;
    return j;
  }

  // Reads a template literal starting at the backtick; returns [end, codeRanges] where nested ${...} bodies are lexed as code.
  function readTemplate(start) {
    const parts = []; // {type, start, end}
    let j = start + 1;
    let segStart = start;
    while (j < src.length) {
      const c = src[j];
      if (c === '\\') { j += 2; continue; }
      if (c === '`') { j++; break; }
      if (c === '$' && src[j + 1] === '{') {
        parts.push({ type: 'code', start: segStart, end: j + 2 });
        const inner = lexRange(j + 2);
        parts.push(...inner.parts);
        j = inner.end;
        segStart = j;
        continue;
      }
      j++;
    }
    parts.push({ type: 'code', start: segStart, end: j });
    return { end: j, parts };
  }

  // Lex code from position p until an unmatched '}' (template expression end) or EOF.
  function lexRange(p) {
    const saveI = i, saveLast = last;
    const parts = [];
    i = p; last = '{';
    let depth = 0;
    let segStart = i;
    const flush = (end) => { if (end > segStart) parts.push({ type: 'code', start: segStart, end }); };
    while (i < src.length) {
      const c = src[i];
      if (c === '/' && src[i + 1] === '/') {
        flush(i); const e = src.indexOf('\n', i); const end = e < 0 ? src.length : e;
        parts.push({ type: 'comment', start: i, end }); i = end; segStart = i; continue;
      }
      if (c === '/' && src[i + 1] === '*') {
        flush(i); const e = src.indexOf('*/', i + 2); const end = e < 0 ? src.length : e + 2;
        parts.push({ type: 'comment', start: i, end }); i = end; segStart = i; continue;
      }
      if (c === '"' || c === "'") { i = readString(c); last = 'str'; continue; }
      if (c === '`') {
        flush(i);
        const t = readTemplate(i);
        parts.push(...t.parts); i = t.end; segStart = i; last = 'str'; continue;
      }
      if (c === '/') {
        const prevIsOperand = last === ')' || last === ']' || last === '}' || last === 'str' || last === 'num' ||
          (/^[A-Za-z_$]/.test(last) && !KEYWORDS_BEFORE_REGEX.has(last));
        if (!prevIsOperand) { i = readRegex(); last = 'str'; continue; }
        i++; last = '/'; continue;
      }
      if (c === '{') { depth++; last = '{'; i++; continue; }
      if (c === '}') {
        if (depth === 0) { flush(i); const end = i; const res = { parts, end }; i = saveI; last = saveLast; return res; }
        depth--; last = '}'; i++; continue;
      }
      if (/[A-Za-z_$]/.test(c)) { let j = i; while (j < src.length && /[\w$]/.test(src[j])) j++; last = src.slice(i, j); i = j; continue; }
      if (/[0-9]/.test(c)) { let j = i; while (j < src.length && /[\w.]/.test(src[j])) j++; last = 'num'; i = j; continue; }
      if (/\s/.test(c)) { i++; continue; }
      last = c; i++;
    }
    flush(src.length);
    const res = { parts, end: src.length };
    i = saveI; last = saveLast;
    return res;
  }

  const top = lexRange(0);
  // Merge adjacent same-type ranges, then slice.
  const merged = [];
  for (const p of top.parts) {
    const prev = merged[merged.length - 1];
    if (prev && prev.type === p.type && prev.end === p.start) prev.end = p.end; else merged.push({ ...p });
  }
  for (const p of merged) push(p.type, p.start, p.end);
  return out;
}

export const stripComments = (src) => lex(src).filter((s) => s.type === 'code').map((s) => s.text).join('');

// Escape every non-ASCII UTF-16 code unit in code segments as \uXXXX (comments untouched).
export function escapeNonAsciiInCode(src) {
  return lex(src).map((s) => (s.type === 'comment' ? s.text : s.text.replace(/[^\x00-\x7f]/g, (ch) => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0')))).join('');
}
