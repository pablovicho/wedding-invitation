import { wedding } from '@/config/wedding.config';

const URL_ = wedding.googleSheets.url.trim();

export const sheetsConfigured = Boolean(URL_);

/** GET ke Google Apps Script (lihat scripts/google-apps-script.gs) */
export async function sheetsGet<T>(params: Record<string, string | number>): Promise<T> {
  const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
  const res = await fetch(`${URL_}?${qs}`);
  if (!res.ok) throw new Error(`Sheets ${res.status}`);
  return res.json();
}

/**
 * POST pakai text/plain supaya tidak ada CORS preflight (Apps Script tidak mendukung OPTIONS).
 */
export async function sheetsPost<T = { ok: boolean }>(action: string, data: Record<string, unknown>): Promise<T> {
  const res = await fetch(URL_, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, ...data }),
  });
  if (!res.ok) throw new Error(`Sheets ${res.status}`);
  const body = await res.json();
  if (!body.ok) throw new Error(body.error ?? 'Gagal menyimpan');
  return body;
}
