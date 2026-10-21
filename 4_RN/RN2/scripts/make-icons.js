const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i];
    for (let k = 0; k < 8; k += 1) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function png(size, paint) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const row = y * (size * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < size; x += 1) {
      const [r, g, b, a = 255] = paint(x, y, size);
      const i = row + 1 + x * 4;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function disk(cx, cy, r, x, y) {
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

function ring(cx, cy, rOut, rIn, x, y) {
  return disk(cx, cy, rOut, x, y) && !disk(cx, cy, rIn, x, y);
}

const out = path.join(__dirname, '..', 'assets');
fs.mkdirSync(out, { recursive: true });

const paper = [237, 228, 208];
const ink = [26, 23, 20];
const oxide = [196, 69, 26];

const icon = png(1024, (x, y, s) => {
  if (ring(s / 2, s / 2, s * 0.38, s * 0.3, x, y)) return oxide;
  if (disk(s / 2, s / 2, s * 0.08, x, y)) return ink;
  if (Math.abs(x - s / 2) < s * 0.018 && Math.abs(y - s / 2) < s * 0.28) return ink;
  return paper;
});

const fg = png(1024, (x, y, s) => {
  if (ring(s / 2, s / 2, s * 0.34, s * 0.26, x, y)) return [...oxide, 255];
  if (disk(s / 2, s / 2, s * 0.07, x, y)) return [...ink, 255];
  if (Math.abs(x - s / 2) < s * 0.016 && Math.abs(y - s / 2) < s * 0.24) return [...ink, 255];
  return [0, 0, 0, 0];
});

const bg = png(1024, () => paper);
const mono = png(1024, (x, y, s) => {
  const on =
    ring(s / 2, s / 2, s * 0.34, s * 0.26, x, y) ||
    disk(s / 2, s / 2, s * 0.07, x, y) ||
    (Math.abs(x - s / 2) < s * 0.016 && Math.abs(y - s / 2) < s * 0.24);
  return on ? [255, 255, 255, 255] : [0, 0, 0, 0];
});

fs.writeFileSync(path.join(out, 'icon.png'), icon);
fs.writeFileSync(path.join(out, 'android-icon-foreground.png'), fg);
fs.writeFileSync(path.join(out, 'android-icon-background.png'), bg);
fs.writeFileSync(path.join(out, 'android-icon-monochrome.png'), mono);
console.log('icons written');
