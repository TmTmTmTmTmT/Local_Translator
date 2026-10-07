// Ollama adapter (OpenAI-compatible /v1/chat/completions; --api native uses /api/chat). SPEC section 2 CLI.
import { pathToFileURL } from 'node:url';
import { runAdapter } from '../lib/adapter.mjs';
import { postJson } from '../lib/http.mjs';
import { makeLlmTranslator, estimateNumCtx, isQwen3, isThinkingModel } from '../lib/llm.mjs';
import { parseArgs } from '../lib/cli.mjs';

const DEFAULT_BASE = 'http://127.0.0.1:11434';

export function makeOllamaChat(opts) {
  const base = (opts.baseUrl || DEFAULT_BASE).replace(/\/$/, '');
  const native = opts.raw.api === 'native';
  const model = opts.model;
  let jsonModeOk = opts.raw.noJsonMode ? false : true;
  let extrasOk = true;
  const thinking = () => extrasOk && isThinkingModel(model);
  return async ({ messages }) => {
    const num_ctx = estimateNumCtx(messages);
    if (native) {
      const body = {
        model, messages, stream: false, format: jsonModeOk ? 'json' : undefined,
        options: { temperature: 0.2, num_ctx },
        ...(thinking() ? { think: false } : {}),
        ...(opts.keepAlive !== undefined ? { keep_alive: opts.keepAlive } : {}),
      };
      const r = await postJson(`${base}/api/chat`, body);
      return r.message?.content ?? '';
    }
    const body = {
      model, messages, stream: false, temperature: 0.2,
      ...(jsonModeOk ? { response_format: { type: 'json_object' } } : {}),
      // OpenAI endpoint ignores some of these on older Ollama; harmless extras.
      options: { num_ctx, temperature: 0.2 },
      ...(thinking() ? { think: false, reasoning_effort: 'none' } : {}),
      ...(opts.keepAlive !== undefined ? { keep_alive: opts.keepAlive } : {}),
    };
    let r;
    try { r = await postJson(`${base}/v1/chat/completions`, body); }
    catch (e) {
      if (e.status === 400 && (body.response_format || body.think === false)) {
        // response_format / think unsupported for this model or Ollama version: drop and remember.
        jsonModeOk = false;
        extrasOk = false;
        delete body.response_format; delete body.think; delete body.reasoning_effort;
        r = await postJson(`${base}/v1/chat/completions`, body);
      } else throw e;
    }
    return r.choices?.[0]?.message?.content ?? '';
  };
}

export async function main(argv) {
  const a = parseArgs(argv);
  return runAdapter({
    argv,
    makeTranslator: (opts) => {
      if (!opts.model) throw new Error('ollama: --model required');
      const suffix = isQwen3(opts.model) && !a.thinking ? '/no_think' : '';
      return makeLlmTranslator({ chat: makeOllamaChat(opts), userSuffix: suffix });
    },
    notes: (opts) => `api=${opts.raw.api || 'openai'}`,
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((e) => { console.error(e.stack || e); process.exit(1); });
}
