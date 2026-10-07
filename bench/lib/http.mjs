// JSON POST with timeout; refuses anything except loopback (SPEC section 5).
export function assertLoopback(url) {
  const h = new URL(url).hostname;
  if (h !== '127.0.0.1' && h !== 'localhost' && h !== '[::1]') throw new Error(`refusing non-loopback host: ${h}`);
}

export async function postJson(url, body, { timeoutMs = 900000 } = {}) {
  assertLoopback(url);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await res.text();
  if (!res.ok) {
    const e = new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
    e.status = res.status;
    throw e;
  }
  try { return JSON.parse(text); } catch { throw new Error(`non-JSON response: ${text.slice(0, 200)}`); }
}
