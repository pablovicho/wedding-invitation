const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Tambahkan basePath ke path file di folder public (next export tidak melakukannya untuk <img>). */
export function asset(path: string): string {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path;
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}
