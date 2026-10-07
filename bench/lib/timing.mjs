// Timing helpers: wall-clock measurement and percentile math.
export async function timed(fn) {
  const t0 = performance.now();
  try {
    const value = await fn();
    return { value, ms: Math.round(performance.now() - t0), error: null };
  } catch (error) {
    return { value: null, ms: Math.round(performance.now() - t0), error };
  }
}

// Linear-interpolated percentile (p in 0..100). Empty -> null.
export function percentile(arr, p) {
  const a = arr.filter((x) => Number.isFinite(x)).sort((x, y) => x - y);
  if (!a.length) return null;
  if (a.length === 1) return a[0];
  const r = (p / 100) * (a.length - 1);
  const lo = Math.floor(r), hi = Math.ceil(r);
  return a[lo] + (a[hi] - a[lo]) * (r - lo);
}

export const median = (arr) => percentile(arr, 50);
export const mean = (arr) => {
  const a = arr.filter((x) => Number.isFinite(x));
  return a.length ? a.reduce((s, x) => s + x, 0) / a.length : null;
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
