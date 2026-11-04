import qrcode from 'qrcode-generator';

const PREFIX = 'TAMU:';

/** El contenido del QR se hace solo ASCII (el nombre se codifica) para que lo lean todos los escáneres. */
export const checkinPayload = (name: string) => PREFIX + encodeURIComponent(name.trim());

export function parseCheckin(text: string): string | null {
  if (!text.startsWith(PREFIX)) return null;
  try {
    return decodeURIComponent(text.slice(PREFIX.length)).trim() || null;
  } catch {
    return null;
  }
}

/** Ruta SVG para los módulos del QR (1 unidad = 1 módulo), más el tamaño del lado */
export function qrPath(text: string): { d: string; size: number } {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
  return { d, size: n };
}
