import fs from 'fs';
import path from 'path';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="#09090b" />
  <rect x="1" y="1" width="62" height="62" rx="11" fill="none" stroke="#27272a" stroke-width="2" />
  <text x="32" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle" letter-spacing="-1">CE</text>
  <circle cx="50" cy="16" r="4" fill="#3b82f6" />
</svg>
`;

function createIco() {
  const width = 32;
  const height = 32;
  
  // Create 32x32 pixel grid (bottom-to-top for BMP)
  // BGRA format
  const pixels = new Uint8Array(width * height * 4);
  
  // Font bitmap for 'C' and 'E' in 32x32
  // Let's render a clean CE monogram on a dark background with blue accent dot
  const grid = Array.from({ length: 32 }, () => new Uint8Array(32));
  
  // Fill background inside rounded rectangle (radius ~5)
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const inBox = x >= 1 && x <= 30 && y >= 1 && y <= 30;
      const cornerTL = x < 6 && y < 6 && ((5 - x) ** 2 + (5 - y) ** 2 > 25);
      const cornerTR = x > 25 && y < 6 && ((x - 26) ** 2 + (5 - y) ** 2 > 25);
      const cornerBL = x < 6 && y > 25 && ((5 - x) ** 2 + (y - 26) ** 2 > 25);
      const cornerBR = x > 25 && y > 25 && ((x - 26) ** 2 + (y - 26) ** 2 > 25);
      
      if (inBox && !cornerTL && !cornerTR && !cornerBL && !cornerBR) {
        grid[y][x] = 1; // background
      }
    }
  }

  // Draw 'C' (x: 5 to 14, y: 9 to 23)
  for (let y = 9; y <= 23; y++) {
    for (let x = 5; x <= 14; x++) {
      const isTop = y <= 12 && x >= 7;
      const isBottom = y >= 20 && x >= 7;
      const isLeft = x <= 8;
      const isCornerOutTL = x < 7 && y < 11;
      const isCornerOutBL = x < 7 && y > 21;
      if ((isTop || isBottom || isLeft) && !isCornerOutTL && !isCornerOutBL) {
        grid[y][x] = 2; // white letter
      }
    }
  }

  // Draw 'E' (x: 16 to 25, y: 9 to 23)
  for (let y = 9; y <= 23; y++) {
    for (let x = 16; x <= 25; x++) {
      const isLeft = x <= 19;
      const isTop = y <= 12 && x <= 25;
      const isMid = y >= 15 && y <= 17 && x <= 23;
      const isBottom = y >= 20 && x <= 25;
      if (isLeft || isTop || isMid || isBottom) {
        grid[y][x] = 2; // white letter
      }
    }
  }

  // Draw blue accent dot at (x: 25, y: 5)
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx * dx + dy * dy <= 2) {
        grid[5 + dy][25 + dx] = 3; // blue dot
      }
    }
  }

  // Populate pixels (BMP is bottom-to-top)
  for (let y = 0; y < 32; y++) {
    const srcY = 31 - y; // flip Y
    for (let x = 0; x < 32; x++) {
      const idx = (y * 32 + x) * 4;
      const val = grid[srcY][x];
      if (val === 1) {
        // Dark bg (#09090b)
        pixels[idx + 0] = 0x0b; // B
        pixels[idx + 1] = 0x09; // G
        pixels[idx + 2] = 0x09; // R
        pixels[idx + 3] = 0xff; // A
      } else if (val === 2) {
        // White text (#ffffff)
        pixels[idx + 0] = 0xff;
        pixels[idx + 1] = 0xff;
        pixels[idx + 2] = 0xff;
        pixels[idx + 3] = 0xff;
      } else if (val === 3) {
        // Blue accent (#3b82f6)
        pixels[idx + 0] = 0xf6;
        pixels[idx + 1] = 0x82;
        pixels[idx + 2] = 0x3b;
        pixels[idx + 3] = 0xff;
      } else {
        // Transparent
        pixels[idx + 0] = 0x00;
        pixels[idx + 1] = 0x00;
        pixels[idx + 2] = 0x00;
        pixels[idx + 3] = 0x00;
      }
    }
  }

  const andMask = new Uint8Array((32 * 32) / 8); // 128 bytes, all 0s (opaque)

  const headerSize = 6;
  const dirEntrySize = 16;
  const bmiHeaderSize = 40;
  const pixelDataSize = pixels.length;
  const andMaskSize = andMask.length;
  const totalImageSize = bmiHeaderSize + pixelDataSize + andMaskSize;
  const totalFileSize = headerSize + dirEntrySize + totalImageSize;

  const buffer = Buffer.alloc(totalFileSize);

  // ICO Header
  buffer.writeUInt16LE(0, 0); // reserved
  buffer.writeUInt16LE(1, 2); // type 1 = icon
  buffer.writeUInt16LE(1, 4); // 1 image

  // Directory Entry
  buffer.writeUInt8(32, 6);   // width
  buffer.writeUInt8(32, 7);   // height
  buffer.writeUInt8(0, 8);    // color count
  buffer.writeUInt8(0, 9);    // reserved
  buffer.writeUInt16LE(1, 10); // planes
  buffer.writeUInt16LE(32, 12); // bit count
  buffer.writeUInt32LE(totalImageSize, 14); // image size
  buffer.writeUInt32LE(headerSize + dirEntrySize, 18); // offset

  // BITMAPINFOHEADER
  let offset = headerSize + dirEntrySize;
  buffer.writeUInt32LE(40, offset); // biSize
  buffer.writeInt32LE(32, offset + 4); // biWidth
  buffer.writeInt32LE(64, offset + 8); // biHeight (double for icon)
  buffer.writeUInt16LE(1, offset + 12); // biPlanes
  buffer.writeUInt16LE(32, offset + 14); // biBitCount
  buffer.writeUInt32LE(0, offset + 16); // biCompression (BI_RGB)
  buffer.writeUInt32LE(pixelDataSize + andMaskSize, offset + 20); // biSizeImage
  buffer.writeInt32LE(0, offset + 24); // biXPelsPerMeter
  buffer.writeInt32LE(0, offset + 28); // biYPelsPerMeter
  buffer.writeUInt32LE(0, offset + 32); // biClrUsed
  buffer.writeUInt32LE(0, offset + 36); // biClrImportant

  offset += bmiHeaderSize;
  Buffer.from(pixels.buffer).copy(buffer, offset);
  offset += pixelDataSize;
  Buffer.from(andMask.buffer).copy(buffer, offset);

  return buffer;
}

const icoBuffer = createIco();

// Target destinations
const targets = [
  'D:/campus-exchange/frontend/public',
  'D:/campus-exchange/backend/public',
  'D:/campus-exchange/backend/public/frontend',
  'D:/campus-exchange/frontend/.build_output/public',
];

for (const dir of targets) {
  if (fs.existsSync(dir)) {
    fs.writeFileSync(path.join(dir, 'favicon.svg'), svgContent, 'utf8');
    fs.writeFileSync(path.join(dir, 'favicon.ico'), icoBuffer);
    console.log(`Generated favicon.svg & favicon.ico in ${dir}`);
  }
}
