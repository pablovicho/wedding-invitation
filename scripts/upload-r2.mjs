#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';

const bucket = process.env.R2_BUCKET || 'wedding';
const root = path.resolve('public/private');
const dryRun = process.argv.includes('--dry-run');

const TYPES = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.mp3': 'audio/mpeg',
};

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const files = [];
for (const file of walk(root)) {
  files.push({ file, key: path.relative(root, file).split(path.sep).join('/') });
}

if (files.length === 0) {
  console.error(`No hay archivos en ${root}`);
  process.exit(1);
}

for (const { file, key } of files) {
  const contentType = TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
  const objectPath = `${bucket}/${key}`;
  console.log(`${dryRun ? '[dry-run] ' : ''}${objectPath}`);
  if (dryRun) continue;
  execFileSync(
    'npx',
    [
      '--yes',
      'wrangler@4',
      'r2',
      'object',
      'put',
      objectPath,
      '--file',
      file,
      '--content-type',
      contentType,
      '--cache-control',
      'public, max-age=31536000, immutable',
    ],
    { stdio: 'inherit' },
  );
}
