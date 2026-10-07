// Builds chat messages from bench/prompt.json + a batch (SPEC section 2, PLAN 4.6).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const DEFAULT_PROMPT_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'prompt.json');

export function loadPrompt(path = DEFAULT_PROMPT_PATH) {
  const p = JSON.parse(readFileSync(path, 'utf8'));
  if (typeof p.system !== 'string') throw new Error('prompt.json: system missing');
  return p;
}

export function systemText(prompt, lang) {
  const note = prompt.langNotes && prompt.langNotes[lang];
  return note ? `${prompt.system}\n\n${note}` : prompt.system;
}

export function batchPayload(lang, context, batch) {
  return {
    lang,
    context: { title: context?.title ?? '', host: context?.host ?? '' },
    blocks: batch.map((b) => ({
      id: b.id,
      items: b.items.map((it) => (it.k === 't' ? { k: 't', i: it.i, text: it.text } : { k: 'x', text: it.text })),
    })),
  };
}

// userSuffix: e.g. "/no_think" for qwen3-like models.
export function buildMessages({ prompt, lang, context, batch, userSuffix = '' }) {
  const user = JSON.stringify(batchPayload(lang, context, batch)) + (userSuffix ? `\n${userSuffix}` : '');
  return [
    { role: 'system', content: systemText(prompt, lang) },
    { role: 'user', content: user },
  ];
}
