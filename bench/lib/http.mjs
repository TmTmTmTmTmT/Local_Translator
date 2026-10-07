import { request as httpRequest } from 'node:http';
// JSON POST with timeout; refuses anything except loopback (SPEC section 5).
export function assertLoopback(url) {
  const h = new URL(url).hostname;
  if (h !== '127.0.0.1' && h !== 'localhost' && h !== '[::1]') throw new Error(`refusing non-loopback host: ${h}`);
}

// node:http instead of global fetch: undici's fetch has a fixed 300 s headersTimeout, which turned slow non-streaming
// completions (ollama qwen3:1.7b with thinking) into "fetch failed" at exactly ~301 s. Here only timeoutMs applies.
export async function postJson(url, body, { timeoutMs = 900000 } = {}) {
  assertLoopback(url);
  const u = new URL(url);
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = httpRequest({
      hostname: u.hostname === '[::1]' ? '::1' : u.hostname, port: u.port || 80, path: u.pathname + u.search, method: 'POST',
      headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) },
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('error', reject);
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        if (res.statusCode < 200 || res.statusCode >= 300) {
          const e = new Error(`HTTP ${res.statusCode}: ${text.slice(0, 300)}`);
          e.status = res.statusCode;
          return reject(e);
        }
        try { resolve(JSON.parse(text)); } catch { reject(new Error(`non-JSON response: ${text.slice(0, 200)}`)); }
      });
    });
    req.setTimeout(timeoutMs, () => req.destroy(new Error(`request timeout after ${timeoutMs}ms`)));
    req.on('error', (e) => reject(e.message === 'fetch failed' ? e : new Error(`fetch failed: ${e.message}`)));
    req.end(payload);
  });
}
