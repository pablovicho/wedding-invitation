import { asset } from './asset';
import { getSupabase, supabaseConfigured } from './supabase';
import { sheetsConfigured, sheetsGet, sheetsPost } from './sheets';

export interface Wish {
  id: string | number;
  name: string;
  message: string;
  created_at: string;
}

/** Se prioriza Google Sheets si su url está completada; de lo contrario, Supabase (si existe el env). */
export const wishesBackend: 'sheets' | 'supabase' | null = sheetsConfigured ? 'sheets' : supabaseConfigured ? 'supabase' : null;

const TABLE = 'guest_book';

export async function listWishes(from: number, size: number): Promise<{ items: Wish[]; total: number }> {
  if (wishesBackend === 'sheets') {
    const r = await sheetsGet<{ items: Wish[]; total: number }>({ action: 'wishes', offset: from, limit: size });
    return { items: r.items ?? [], total: r.total ?? 0 };
  }
  const sb = await getSupabase();
  const { data, error, count } = await sb
    .from(TABLE)
    .select('id,name,message,created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + size - 1);
  if (error) throw error;
  return { items: data ?? [], total: count ?? from + (data?.length ?? 0) };
}

export async function addWish(name: string, message: string, turnstileToken?: string): Promise<Wish> {
  if (wishesBackend === 'sheets') {
    const r = await sheetsPost<{ ok: boolean; item: Wish }>('wish', { name, message, turnstileToken });
    return r.item;
  }
  // La escritura directa está bloqueada por RLS: solo el endpoint con Turnstile puede insertar.
  const res = await fetch(asset('/api/wish'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, message, token: turnstileToken }),
  });
  const body = (await res.json().catch(() => ({}))) as { ok?: boolean; item?: Wish; error?: string };
  if (!res.ok || !body.ok || !body.item) {
    throw new Error(body.error ?? 'No se pudo guardar el mensaje');
  }
  return body.item;
}
