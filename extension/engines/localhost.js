// localhost 엔진: Ollama / MLX(OpenAI 호환 chat), MT 모드(mtmode.js) 및 CT2 MT 서버. 루프백 호스트만 허용 (GUIDELINES 보안).
(function () {
  'use strict';
  const E = () => globalThis.KT.engines;

  const DEFAULT_BASE = { ollama: 'http://127.0.0.1:11434', mlx: 'http://127.0.0.1:8080', ct2: 'http://127.0.0.1:8765' };
  const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]'];
  const TIMEOUT_MS = 60000;
  const BACKOFF_MS = 500;
  const MAX_RETRIES = 2; // 429/5xx

  // 정확히 루프백 호스트이고 userinfo 없는 http(s) URL만 통과. 반환: 끝 슬래시 없는 origin.
  function validateBaseUrl(baseUrl) {
    let u;
    try { u = new URL(String(baseUrl)); } catch (e) { throw E().makeError('engine_unavailable', 'invalid baseUrl'); }
    const ok = (u.protocol === 'http:' || u.protocol === 'https:')
      && !u.username && !u.password
      && LOOPBACK_HOSTS.includes(u.hostname);
    if (!ok) throw E().makeError('engine_unavailable', 'baseUrl must be localhost, 127.0.0.1 or [::1]');
    return u.origin;
  }

  const isQwen3 = (m) => /qwen3/i.test(m || '');

  function estimateTokens(text) {
    const cjk = (text.match(/[　-鿿가-힯]/g) || []).length;
    return Math.ceil(cjk + (text.length - cjk) / 3);
  }
  function estimateMaxTokens(messages) {
    const inTok = messages.reduce((s, m) => s + estimateTokens(m.content), 0);
    return Math.min(8192, Math.max(1024, Math.ceil(inTok * 1.5)));
  }

  // 단일 HTTP 호출: 타임아웃, 429/5xx 백오프(최대 2회 재시도), 에러 코드 매핑. JSON 응답 반환.
  async function requestJson(ctx, url, init) {
    for (let attempt = 0; ; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), ctx.timeoutMs);
      let res, text;
      try {
        res = await ctx.fetch(url, Object.assign({ redirect: 'error', signal: ctrl.signal }, init));
        text = await res.text();
      } catch (e) {
        if (ctrl.signal.aborted) throw E().makeError('timeout', 'request timed out');
        throw E().makeError('engine_unavailable', 'local server unreachable');
      } finally {
        clearTimeout(timer);
      }
      if (res.ok) {
        try { return JSON.parse(text); } catch (e) { throw E().makeError('bad_response', 'non-JSON response'); }
      }
      const retryable = res.status === 429 || res.status >= 500;
      if (retryable && attempt < MAX_RETRIES) { await ctx.sleep(BACKOFF_MS * 2 ** attempt); continue; }
      const err = res.status === 429 ? E().makeError('rate_limited', 'HTTP 429')
        : res.status >= 500 || res.status === 401 || res.status === 403 ? E().makeError('engine_unavailable', `HTTP ${res.status}`)
        : E().makeError('bad_response', `HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
  }

  const postJson = (ctx, url, body) => requestJson(ctx, url, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });

  function makeCtx(opts) {
    const o = opts || {};
    return {
      fetch: o.fetch || ((...a) => globalThis.fetch(...a)),
      sleep: o.sleep || E().sleep,
      timeoutMs: o.timeoutMs || TIMEOUT_MS,
    };
  }

  function resolveBase(kind, settings) {
    const l = (settings && settings.localhost) || {};
    return validateBaseUrl(l.baseUrl || DEFAULT_BASE[kind]);
  }

  async function llmChat(ctx, kind, base, model, messages) {
    const body = { model, messages, stream: false, temperature: 0.2, max_tokens: estimateMaxTokens(messages) };
    if (kind === 'mlx' && isQwen3(model)) body.chat_template_kwargs = { enable_thinking: false };
    if (kind === 'ollama') body.response_format = { type: 'json_object' };
    const url = `${base}/v1/chat/completions`;
    let r;
    try { r = await postJson(ctx, url, body); } catch (e) {
      // 모델/버전이 response_format 미지원이면 제거 후 재시도.
      if (e.status === 400 && body.response_format) {
        delete body.response_format;
        r = await postJson(ctx, url, body);
      } else throw e;
    }
    const content = r && r.choices && r.choices[0] && r.choices[0].message && r.choices[0].message.content;
    return typeof content === 'string' ? content : '';
  }

  function createLlmEngine(kind, opts) {
    const ctx = makeCtx(opts);
    return {
      id: `local:${kind}`,
      kind: 'localhost',
      langs: ['en', 'ja', 'zh'],
      batchLimit: { chars: 3000, blocks: 20 },
      concurrency: 1,
      async translate(blocks, context, lang, settings) {
        const base = resolveBase(kind, settings);
        const model = ((settings && settings.localhost && settings.localhost.model) || '').trim();
        if (!model) throw E().makeError('engine_unavailable', 'localhost.model not set');
        const suffix = isQwen3(model) ? '/no_think' : '';
        const messages = E().buildMessages({ lang, context, blocks, userSuffix: suffix });
        for (let attempt = 0; attempt < 2; attempt++) { // 잘못된 JSON이면 1회 재시도
          const text = await llmChat(ctx, kind, base, model, messages);
          const map = E().parseLlmOutput(text);
          if (!map) continue;
          const out = new Map();
          for (const b of blocks) {
            const v = E().validateSlots(b, map);
            if (Object.keys(v.slots).length) out.set(b.id, v.slots);
          }
          if (out.size || !blocks.some((b) => b.items.some((it) => it.k === 't'))) return out;
        }
        throw E().makeError('bad_response', 'invalid JSON from model after retry');
      },
      async status() {
        try {
          const base = resolveBase(kind, null);
          const path = kind === 'ollama' ? '/api/tags' : '/v1/models';
          await requestJson(Object.assign({}, ctx, { timeoutMs: 3000 }), base + path, { method: 'GET' });
          return { available: true };
        } catch (e) { return { available: false, reason: e.code || 'engine_unavailable' }; }
      },
    };
  }

  const DEFAULT_KEEP_ALIVE = 300; // 초. Ollama 모델 상주 시간(메모리 정책: 짧게)

  function resolveKeepAlive(settings) {
    const v = Number(settings && settings.localhost && settings.localhost.keepAlive);
    return Number.isFinite(v) && v >= -1 ? Math.trunc(v) : DEFAULT_KEEP_ALIVE;
  }

  function resolveFamily(settings, model) {
    const M = E().mtmode;
    const f = settings && settings.localhost && settings.localhost.family;
    if (M.FAMILIES.includes(f)) return f;
    return M.inferFamily(model) || 'chat';
  }

  function estimateNumCtx(messages) {
    const inTok = messages.reduce((n, m) => n + estimateTokens(m.content), 0);
    return Math.min(8192, Math.max(2048, Math.ceil((inTok * 2.5 + 256) / 1024) * 1024));
  }

  // 단일 요청 -> 텍스트. ollama: /api/chat(keep_alive 포함), mlx: translategemma는 raw /v1/completions, 그 외 chat completions.
  async function mtChat(ctx, runtime, base, model, family, keepAlive, request) {
    const s = E().mtmode.SAMPLING[family];
    const messages = request.messages || [{ role: 'user', content: request.prompt }];
    if (runtime === 'ollama') {
      const options = { temperature: s.temperature, num_ctx: estimateNumCtx(messages) };
      if (s.top_p !== undefined) options.top_p = s.top_p;
      if (s.top_k !== undefined) options.top_k = s.top_k;
      if (s.repetition_penalty !== undefined) options.repeat_penalty = s.repetition_penalty;
      const r = await postJson(ctx, `${base}/api/chat`, { model, messages, stream: false, keep_alive: keepAlive, options });
      return (r && r.message && typeof r.message.content === 'string') ? r.message.content : '';
    }
    const common = { model: 'default_model', stream: false, max_tokens: estimateMaxTokens(messages), temperature: s.temperature };
    if (s.top_p !== undefined) common.top_p = s.top_p;
    if (s.top_k !== undefined) common.top_k = s.top_k;
    if (s.repetition_penalty !== undefined) common.repetition_penalty = s.repetition_penalty;
    if (request.prompt !== undefined) {
      const r = await postJson(ctx, `${base}/v1/completions`, Object.assign(common, { prompt: request.prompt, stop: request.stop }));
      return (r && r.choices && r.choices[0] && typeof r.choices[0].text === 'string') ? r.choices[0].text : '';
    }
    if (isQwen3(model)) common.chat_template_kwargs = { enable_thinking: false };
    const r = await postJson(ctx, `${base}/v1/chat/completions`, Object.assign(common, { messages }));
    return (r && r.choices && r.choices[0] && r.choices[0].message && typeof r.choices[0].message.content === 'string') ? r.choices[0].message.content : '';
  }

  // MT 모드 엔진 (local:mt-ollama / local:mt-mlx). 블록당 1요청, 동시성 1 (mtmode.js).
  function createMtEngine(runtime, opts) {
    const ctx = makeCtx(opts);
    const kind = runtime; // DEFAULT_BASE 키와 동일
    return {
      id: `local:mt-${runtime}`,
      kind: 'localhost',
      langs: ['en', 'ja', 'zh'],
      batchLimit: { chars: 1500, blocks: 8 },
      concurrency: 1,
      async translate(blocks, context, lang, settings) {
        const base = resolveBase(kind, settings);
        const model = ((settings && settings.localhost && settings.localhost.model) || '').trim();
        if (runtime === 'ollama' && !model) throw E().makeError('engine_unavailable', 'localhost.model not set');
        const family = resolveFamily(settings, model);
        const keepAlive = resolveKeepAlive(settings);
        const tr = E().mtmode.makeMtTranslator({
          family, runtime, userSuffix: family === 'chat' && isQwen3(model) ? '/no_think' : '',
          chat: ({ request }) => mtChat(ctx, runtime, base, model, family, keepAlive, request),
        });
        const r = await tr({ blocks, lang, context });
        if (!r.out.size && r.errors.length) throw E().makeError(r.errors[0].code, r.errors[0].message);
        return r.out;
      },
      async status() {
        try {
          const base = resolveBase(kind, null);
          const path = runtime === 'ollama' ? '/api/tags' : '/v1/models';
          await requestJson(Object.assign({}, ctx, { timeoutMs: 3000 }), base + path, { method: 'GET' });
          return { available: true };
        } catch (e) { return { available: false, reason: e.code || 'engine_unavailable' }; }
      },
    };
  }

  function createCt2Engine(opts) {
    const ctx = makeCtx(opts);
    return {
      id: 'local:ct2',
      kind: 'localhost',
      langs: ['en', 'ja', 'zh'],
      batchLimit: { chars: 6000, blocks: 40 },
      concurrency: 2,
      async translate(blocks, context, lang, settings) {
        const base = resolveBase('ct2', settings);
        const plan = E().planBatch(blocks);
        let translations = [];
        if (plan.texts.length) {
          const zh = blocks.find((b) => /^zh-/.test(b.lang || ''));
          const src = lang === 'zh' && zh ? zh.lang : lang;
          const r = await postJson(ctx, `${base}/translate`, { src, tgt: 'ko', texts: plan.texts });
          translations = r && r.translations;
          if (!Array.isArray(translations) || translations.length !== plan.texts.length) {
            throw E().makeError('bad_response', 'translations length mismatch');
          }
        }
        return E().assembleBatch(blocks, plan, translations);
      },
      async status() {
        try {
          const base = resolveBase('ct2', null);
          await requestJson(Object.assign({}, ctx, { timeoutMs: 3000 }), `${base}/health`, { method: 'GET' });
          return { available: true };
        } catch (e) { return { available: false, reason: e.code || 'engine_unavailable' }; }
      },
    };
  }

  const api = { validateBaseUrl, createLlmEngine, createMtEngine, createCt2Engine, LOOPBACK_HOSTS };
  globalThis.KT = globalThis.KT || {};
  globalThis.KT.engines = Object.assign(globalThis.KT.engines || {}, api);
  if (typeof module !== 'undefined') module.exports = api;
})();
