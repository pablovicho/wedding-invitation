const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? '').replace(/\/$/, '');

/**
 * Agrega basePath a las rutas de public/ y permite servir /private/ desde R2 u otro CDN.
 * Si NEXT_PUBLIC_MEDIA_BASE_URL está definido, /private/... se convierte en <MEDIA_BASE>/...
 */
export function asset(path: string): string {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path;
  if (MEDIA_BASE && path.startsWith('/private/')) return `${MEDIA_BASE}${path.slice('/private'.length)}`;
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}
