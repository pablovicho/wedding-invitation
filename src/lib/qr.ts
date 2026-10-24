import qrcode from 'qrcode-generator';

const PREFIX = 'TAMU:';

/** Isi QR dibuat ASCII saja (nama di-encode) supaya terbaca semua scanner. */
export const checkinPayload = (name: string) => PREFIX + encodeURIComponent(name.trim());

export function parseCheckin(text: string): string | null {
  if (!text.startsWith(PREFIX)) return null;
  try {
    return decodeURIComponent(text.slice(PREFIX.length)).trim() || null;
  } catch {
    return null;
  }
}

/** Path SVG untuk modul QR (1 unit = 1 modul), plus ukuran sisi */
export function qrPath(text: string): { d: string; size: number } {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
  return { d, size: n };
}
