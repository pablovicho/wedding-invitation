import type { SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// NEXT_PUBLIC_SUPABASE_KEY tetap didukung untuk setup lama
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabaseConfigured = Boolean(url && key);

let client: Promise<SupabaseClient> | null = null;

/** Di-load dinamis supaya library Supabase tidak ikut membebani halaman awal. */
export function getSupabase(): Promise<SupabaseClient> {
  if (!supabaseConfigured) return Promise.reject(new Error('Supabase belum dikonfigurasi'));
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(url!, key!, { auth: { persistSession: false } }),
  );
  return client;
}
