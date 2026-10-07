// LLM batch translator: prompt -> chat() -> parse; one retry on JSON failure (task spec), then per-block error.
import { buildMessages, loadPrompt } from './prompt.mjs';
import { parseBatchOutput } from './parse.mjs';

export const isQwen3 = (model) => /qwen3/i.test(model || '');
export const isThinkingModel = (model) => /qwen3|deepseek-r1|qwq|gpt-oss|magistral/i.test(model || '');

// Rough token estimate: CJK ~1 token/char, others ~chars/3.
export function estimateTokens(text) {
  const cjk = (text.match(/[　-鿿가-힯]/g) || []).length;
  return Math.ceil(cjk + (text.length - cjk) / 3);
}

// num_ctx for Ollama: prompt + expected output (~1.3x input payload) + headroom, rounded to 1024, 2048..32768.
export function estimateNumCtx(messages) {
  const inTok = messages.reduce((s, m) => s + estimateTokens(m.content), 0);
  const need = Math.ceil(inTok * 2.2 + 768);
  return Math.min(32768, Math.max(2048, Math.ceil(need / 1024) * 1024));
}

export function estimateMaxTokens(messages) {
  const inTok = messages.reduce((s, m) => s + estimateTokens(m.content), 0);
  return Math.min(8192, Math.max(1024, Math.ceil(inTok * 1.5)));
}

export function makeLlmTranslator({ chat, prompt = loadPrompt(), userSuffix = '' }) {
  return async ({ batch, lang, context }) => {
    const messages = buildMessages({ prompt, lang, context, batch, userSuffix });
    let parsed = null, retried = false, firstFailed = false;
    for (let attempt = 0; attempt < 2; attempt++) {
      const text = await chat({ messages, batch, attempt });
      parsed = parseBatchOutput(text, batch);
      if (parsed.valid) break;
      if (attempt === 0) { retried = true; firstFailed = true; }
    }
    if (!parsed.valid) {
      return {
        blocks: batch.map((b) => ({ id: b.id, slots: null, error: `JSON parse failure after retry: ${parsed.error}` })),
        jsonValid: false, retried: true,
      };
    }
    return { blocks: parsed.blocks, jsonValid: true, retried: firstFailed, repaired: !!parsed.repaired };
  };
}
