#!/usr/bin/env node
/**
 * Compila y sube la carpeta out/ a Cloudflare Pages (Direct Upload).
 * Los datos reales (config y public/private) también se suben desde el portátil, pero nunca llegan a GitHub.
 *
 *   npm run deploy                         -> proyecto "marceypablo" (usando wrangler)
 *   CF_PAGES_PROJECT=nombre npm run deploy -> otro proyecto
 *   npm run build:upload                   -> solo comprobar + compilar, luego subir manualmente la carpeta out/
 *                                             mediante el panel de Cloudflare (sin wrangler)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');

const project = process.env.CF_PAGES_PROJECT || 'marceypablo';
if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(project)) {
  console.error('✖ CF_PAGES_PROJECT contiene caracteres no válidos. Usa solo minúsculas, números y guiones.');
  process.exit(1);
}
// Comparar sin el comentario de cabecera (la cabecera del archivo real difiere del ejemplo)
const body = (f) => readFileSync(f, 'utf8').replace(/\/\*\*[\s\S]*?\*\//, '');
const config = readFileSync('src/config/wedding.config.ts', 'utf8');

if (body('src/config/wedding.config.ts') === body('src/config/wedding.config.example.ts')) {
  console.error('✖ src/config/wedding.config.ts aún contiene datos de ejemplo. Ingresa los datos reales antes de la publicación.');
  process.exit(1);
}
if (!/url:\s*'https:\/\//.test(config)) {
  console.warn('⚠  site.url no está completo — la previsualización de imágenes en WhatsApp no funcionará correctamente.');
}
if (/allowThemePreview:\s*true/.test(config)) {
  console.warn('⚠  allowThemePreview aún es true — los invitados pueden cambiar el tema a través de ?theme=&preview');
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const run = (file, args, env = {}) =>
  execFileSync(file, args, { stdio: 'inherit', env: { ...process.env, ...env } });

// Dominio personalizado en la raíz: sin base path
run(npm, ['run', 'build'], { BASE_PATH: '' });

if (process.env.NEXT_PUBLIC_MEDIA_BASE_URL) {
  rmSync(path.resolve('out/private'), { recursive: true, force: true });
  console.log('✓ out/private omitido: las imágenes se sirven desde NEXT_PUBLIC_MEDIA_BASE_URL');
}

if (process.argv.includes('--build-only')) {
  console.log(`
✓ Compilación completada. Sube la carpeta "out" manualmente a través del panel de Cloudflare:
    ${path.resolve('out')}
  Workers & Pages -> proyecto marceypablo -> Crear despliegue -> arrastra y suelta la carpeta "out" -> Guardar y Desplegar`);
  process.exit(0);
}

run(npx, [
  '--yes',
  'wrangler@4',
  'pages',
  'deploy',
  'out',
  `--project-name=${project}`,
  '--branch=main',
  '--commit-dirty=true',
]);
