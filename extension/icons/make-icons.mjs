// Generates simple PNG icons (blue gradient rounded square + white speech bubble) with a pure-JS encoder.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'latin1');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

export function encodePng(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function inRoundRect(x, y, x0, y0, x1, y1, r) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.min(Math.max(x, x0 + r), x1 - r);
  const cy = Math.min(Math.max(y, y0 + r), y1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

function inTriangle(px, py, a, b, c) {
  const s = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
  const p = [px, py];
  const d1 = s(p, a, b), d2 = s(p, b, c), d3 = s(p, c, a);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}

function coverage(size, test) {
  const n = 3;
  let hit = 0;
  for (let sy = 0; sy < n; sy++) {
    for (let sx = 0; sx < n; sx++) {
      if (test((sx + 0.5) / n, (sy + 0.5) / n)) hit++;
    }
  }
  return hit / (n * n);
}

export function renderIcon(size) {
  const rgba = new Uint8Array(size * size * 4);
  const u = (v) => v / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const bg = coverage(size, (fx, fy) => inRoundRect(u(x + fx), u(y + fy), 0, 0, 1, 1, 0.22));
      const bubble = coverage(size, (fx, fy) => {
        const X = u(x + fx), Y = u(y + fy);
        return inRoundRect(X, Y, 0.18, 0.2, 0.82, 0.66, 0.12) ||
          inTriangle(X, Y, [0.32, 0.62], [0.5, 0.62], [0.3, 0.8]);
      });
      const dots = coverage(size, (fx, fy) => {
        const X = u(x + fx), Y = u(y + fy);
        return [0.35, 0.5, 0.65].some((cx) => (X - cx) ** 2 + (Y - 0.43) ** 2 <= 0.045 ** 2);
      });
      const t = (x + y) / (2 * size);
      const base = [0x3b + (0x1d - 0x3b) * t, 0x9c + (0x4e - 0x9c) * t, 0xff + (0xd8 - 0xff) * t];
      let wv = bubble * (1 - dots * 0.85);
      const o = (y * size + x) * 4;
      for (let i = 0; i < 3; i++) rgba[o + i] = Math.round(base[i] * (1 - wv) + 255 * wv);
      rgba[o + 3] = Math.round(bg * 255);
    }
  }
  return rgba;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const s of [16, 32, 48, 96, 128]) {
    writeFileSync(join(dir, `icon-${s}.png`), encodePng(s, s, renderIcon(s)));
  }
}
