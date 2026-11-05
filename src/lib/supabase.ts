import type { SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// NEXT_PUBLIC_SUPABASE_KEY se sigue admitiendo para configuraciones antiguas
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabaseConfigured = Boolean(url && key);

let client: Promise<SupabaseClient> | null = null;

/** Se carga dinámicamente para que la librería de Supabase no sobrecargue la página inicial. */
export function getSupabase(): Promise<SupabaseClient> {
  if (!supabaseConfigured) return Promise.reject(new Error('Supabase no ha sido configurado'));
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(url!, key!, { auth: { persistSession: false } }),
  );
  return client;
}
