#!/usr/bin/env node
/**
 * Kompres semua foto di public/images supaya undangan ringan dibuka pakai data seluler.
 *
 *   npm run images                       -> resize (maks 1600px) + convert ke .webp
 *   npm run images -- --og <path-foto>   -> sekalian buat public/images/og.jpg (preview link WhatsApp)
 *
 * File .jpg/.png asli TIDAK dihapus; hapus sendiri setelah config menunjuk ke .webp.
 */
import { readdir, stat, rename } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('public/images');
const MAX = 1600;
const QUALITY = 80;
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXT.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

const kb = (n) => `${Math.round(n / 1024)}KB`;

async function optimize(file) {
  if (file.endsWith(`${path.sep}og.jpg`)) return;
  const ext = path.extname(file).toLowerCase();
  const out = file.slice(0, -ext.length) + '.webp';
  const before = (await stat(file)).size;
  const meta = await sharp(file).metadata();
  const tooBig = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX;
  if (ext === '.webp' && !tooBig && before < 400 * 1024) return;

  const tmp = `${out}.tmp`;
  await sharp(file)
    .rotate()
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(tmp);
  const after = (await stat(tmp)).size;
  await rename(tmp, out);
  console.log(`✓ ${path.relative(ROOT, out)}  ${kb(before)} -> ${kb(after)}`);
}

async function makeOg(src) {
  const out = path.join(ROOT, 'og.jpg');
  await sharp(src).rotate().resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 78, mozjpeg: true }).toFile(out);
  console.log(`✓ og.jpg dibuat dari ${src}`);
}

const ogIndex = process.argv.indexOf('--og');
for await (const file of walk(ROOT)) await optimize(file);
if (ogIndex > -1 && process.argv[ogIndex + 1]) await makeOg(process.argv[ogIndex + 1]);
console.log('Selesai.');
