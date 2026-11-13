// Regenerates public/favicon.ico from public/favicon.svg (the GraduationCap logo).
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "public", "favicon.svg"));

const sizes = [16, 32, 48, 64];
const pngs = [];
for (const size of sizes) {
  const png = await sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();
  pngs.push({ size, png });
}

// ICO: ICONDIR + ICONDIRENTRY[] + PNG payloads (PNG-in-ICO is supported by all modern browsers)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(pngs.length, 4); // count

const entries = [];
let offset = 6 + pngs.length * 16;
for (const { size, png } of pngs) {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette colors
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // size of image data
  entry.writeUInt32LE(offset, 12); // offset
  entries.push(entry);
  offset += png.length;
}

const ico = Buffer.concat([header, ...entries, ...pngs.map((p) => p.png)]);
writeFileSync(join(root, "public", "favicon.ico"), ico);
console.log(`favicon.ico written: ${ico.length} bytes (${sizes.join(", ")})`);
