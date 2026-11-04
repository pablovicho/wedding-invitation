const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Agrega basePath a la ruta del archivo en la carpeta public (next export no lo hace para <img>). */
export function asset(path: string): string {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path;
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}
