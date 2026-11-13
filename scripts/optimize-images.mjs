#!/usr/bin/env node
/**
 * Comprime todas las fotos de public/images para que la invitación sea ligera al abrirla con datos móviles.
 *
 *   npm run images                       -> redimensionar (máx. 1600px) + convertir a .webp
 *                                           (carpetas public/images y public/private)
 *   npm run images -- --og <ruta-foto>   -> además crear la imagen de vista previa del enlace de WhatsApp (1200x630):
 *                                           public/private/og.jpg si existe la carpeta private; si no, public/images/og.jpg
 *
 * Los archivos .jpg/.png originales NO se eliminan; elimínalos tú mismo después de que la config apunte a .webp.
 */
import { existsSync } from 'node:fs';
import { readdir, stat, rename } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOTS = ['public/images', 'public/private'].map((d) => path.resolve(d)).filter((d) => existsSync(d));
const OG_DIR = existsSync(path.resolve('public/private')) ? path.resolve('public/private') : path.resolve('public/images');
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
  console.log(`✓ ${path.relative(process.cwd(), out)}  ${kb(before)} -> ${kb(after)}`);
}

async function makeOg(src) {
  const out = path.join(OG_DIR, 'og.jpg');
  await sharp(src).rotate().resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 78, mozjpeg: true }).toFile(out);
  console.log(`✓ ${path.relative(process.cwd(), out)} created from ${src}`);
}

const ogIndex = process.argv.indexOf('--og');
for (const root of ROOTS) for await (const file of walk(root)) await optimize(file);
if (ogIndex > -1 && process.argv[ogIndex + 1]) await makeOg(process.argv[ogIndex + 1]);
console.log('Finalizado.');
