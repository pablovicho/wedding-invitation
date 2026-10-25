#!/usr/bin/env node
/**
 * Data undangan asli disimpan di src/config/wedding.config.ts yang di-.gitignore
 * (repo ini public). Kalau file itu belum ada (mis. baru clone), buat dari contoh.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const target = 'src/config/wedding.config.ts';
const example = 'src/config/wedding.config.example.ts';

const HEADER = `/**
 * ============================================================
 *  DATA UNDANGAN ASLI KAMU — file ini TIDAK ikut ter-commit (.gitignore).
 *  Edit isinya, lalu \`npm run dev\` untuk melihat hasil.
 *  Foto pribadi taruh di public/private/, lalu \`npm run images\`.
 *  Backup file ini (mis. ke Google Drive) — tidak ada salinannya di GitHub.
 * ============================================================
 */`;

if (!existsSync(target)) {
  const src = readFileSync(example, 'utf8');
  writeFileSync(target, src.replace(/\/\*\*[\s\S]*?\*\//, HEADER));
  console.log(`ℹ  ${target} dibuat dari contoh. Isi data asli di file itu — file ini tidak ikut ter-commit.`);
}
