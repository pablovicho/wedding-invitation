#!/usr/bin/env node
/**
 * Compila y sube la carpeta out/ a Cloudflare Pages (Direct Upload).
 * Los datos reales (config y public/private) también se suben desde el portátil, pero nunca llegan a GitHub.
 *
 *   npm run deploy                         -> proyecto "undangan" (usando wrangler)
 *   CF_PAGES_PROJECT=nombre npm run deploy -> otro proyecto
 *   npm run build:upload                   -> solo comprobar + compilar, luego subir manualmente la carpeta out/
 *                                             mediante el panel de Cloudflare (sin wrangler)
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const project = process.env.CF_PAGES_PROJECT || 'undangan';
// Comparar sin el comentario de cabecera (la cabecera del archivo real difiere del ejemplo)
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

// Dominio personalizado en la raíz: sin base path
run('npm run build', { BASE_PATH: '' });

if (process.argv.includes('--build-only')) {
  console.log(`
✓ Build selesai. Upload folder ini lewat dashboard Cloudflare:
    ${path.resolve('out')}
  Workers & Pages -> project undangan -> Create deployment -> drag & drop folder "out" -> Save and Deploy`);
  process.exit(0);
}

run(`npx --yes wrangler@4 pages deploy out --project-name=${project} --branch=main --commit-dirty=true`);
