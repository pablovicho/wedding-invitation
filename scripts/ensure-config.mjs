#!/usr/bin/env node
/**
 * Los datos reales de la invitación se guardan en src/config/wedding.config.ts, que está en .gitignore
 * (este repositorio es público). Si ese archivo aún no existe (p. ej. recién clonado), créalo a partir del ejemplo.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const target = 'src/config/wedding.config.ts';
const example = 'src/config/wedding.config.example.ts';

const HEADER = `/**
 * ============================================================
 *  TUS DATOS REALES DE LA INVITACIÓN — este archivo NO se sube al repo (.gitignore).
 *  Edita su contenido y luego ejecuta \`npm run dev\` para ver el resultado.
 *  Pon las fotos personales en public/private/ y luego ejecuta \`npm run images\`.
 *  Haz una copia de seguridad de este archivo (p. ej. en Google Drive) — no hay copia en GitHub.
 * ============================================================
 */`;

if (!existsSync(target)) {
  const src = readFileSync(example, 'utf8');
  writeFileSync(target, src.replace(/\/\*\*[\s\S]*?\*\//, HEADER));
  console.log(`ℹ  ${target} Creado a partir de una plantilla. Introduce los datos reales en ese archivo; este archivo no se incluye en el repositorio..`);
}
