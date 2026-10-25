#!/usr/bin/env node
/**
 * Build lalu upload folder out/ ke Cloudflare Pages (Direct Upload).
 * Data asli (config & public/private) ikut ter-upload dari laptop, tapi tidak pernah masuk GitHub.
 *
 *   npm run deploy                         -> project "undangan" (pakai wrangler)
 *   CF_PAGES_PROJECT=nama npm run deploy   -> project lain
 *   npm run build:upload                   -> cek + build saja, lalu upload folder out/ manual
 *                                             lewat dashboard Cloudflare (tanpa wrangler)
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const project = process.env.CF_PAGES_PROJECT || 'undangan';
// Bandingkan tanpa komentar header (header file asli berbeda dari contoh)
const body = (f) => readFileSync(f, 'utf8').replace(/\/\*\*[\s\S]*?\*\//, '');
const config = readFileSync('src/config/wedding.config.ts', 'utf8');

if (body('src/config/wedding.config.ts') === body('src/config/wedding.config.example.ts')) {
  console.error('✖ src/config/wedding.config.ts masih berisi data contoh. Isi data asli dulu sebelum deploy.');
  process.exit(1);
}
if (!/url:\s*'https:\/\//.test(config)) {
  console.warn('⚠  site.url belum diisi — preview gambar di WhatsApp tidak akan muncul.');
}
if (/allowThemePreview:\s*true/.test(config)) {
  console.warn('⚠  allowThemePreview masih true — tamu bisa mengganti tema lewat ?theme=&preview');
}

const run = (cmd, env = {}) => execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } });

// Custom domain di root: tanpa base path
run('npm run build', { BASE_PATH: '' });

if (process.argv.includes('--build-only')) {
  console.log(`
✓ Build selesai. Upload folder ini lewat dashboard Cloudflare:
    ${path.resolve('out')}
  Workers & Pages -> project undangan -> Create deployment -> drag & drop folder "out" -> Save and Deploy`);
  process.exit(0);
}

run(`npx --yes wrangler@4 pages deploy out --project-name=${project} --branch=main --commit-dirty=true`);
