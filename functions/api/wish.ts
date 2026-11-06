// Cloudflare Pages Function: alta de mensajes del libro de visitas.
//
// Ruta pública: POST /api/wish
//
// Variables de entorno del proyecto de Cloudflare Pages (Production & Preview):
//   SUPABASE_URL               URL del proyecto Supabase
//   SUPABASE_SERVICE_ROLE_KEY  service_role key (nunca exponer al cliente)
//   TURNSTILE_SECRET           secreto de Cloudflare Turnstile
//   ALLOWED_ORIGIN             opcional, por defecto "*"
//
// La tabla guest_book tiene RLS sin política de INSERT para anon: solo este endpoint
// (service_role) puede escribir. El trigger de la base aplica además los límites de frecuencia.
//
// Este archivo se despliega automáticamente con `wrangler pages deploy out`.

import { createClient } from '@supabase/supabase-js';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  TURNSTILE_SECRET: string;
  ALLOWED_ORIGIN?: string;
}

interface Context {
  request: Request;
  env: Env;
}

interface Payload {
  name?: unknown;
  message?: unknown;
  token?: unknown;
}

const corsHeaders = (env: Env) => ({
  'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN ?? '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
});

function json(env: Env, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(env), 'Content-Type': 'application/json' },
  });
}

function clean(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, max);
}

async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token }),
  });
  if (!res.ok) return false;
  const result = (await res.json()) as { success?: boolean };
  return result.success === true;
}

export async function onRequest({ request, env }: Context): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(env) });
  }
  if (request.method !== 'POST') {
    return json(env, { ok: false, error: 'Método no permitido' }, 405);
  }

  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return json(env, { ok: false, error: 'Cuerpo inválido' }, 400);
  }

  const name = clean(payload.name, 60);
  const message = clean(payload.message, 500);
  if (!name || !message) {
    return json(env, { ok: false, error: 'El nombre y el mensaje son obligatorios' }, 400);
  }

  if (!env.TURNSTILE_SECRET) {
    return json(env, { ok: false, error: 'La verificación anti-spam no está configurada' }, 500);
  }

  const token = typeof payload.token === 'string' ? payload.token : '';
  if (!token || !(await verifyTurnstile(token, env.TURNSTILE_SECRET))) {
    return json(env, { ok: false, error: 'Verificación anti-spam fallida' }, 400);
  }

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(env, { ok: false, error: 'Supabase no está configurado en el servidor' }, 500);
  }

  const clientIp = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
    global: { headers: clientIp ? { 'x-client-ip': clientIp } : {} },
  });

  const { data, error } = await supabase
    .from('guest_book')
    .insert({ name, message })
    .select('id,name,message,created_at')
    .single();

  if (error) {
    console.error('guest_book insert failed', error);
    return json(env, { ok: false, error: 'No se pudo guardar el mensaje' }, 500);
  }

  return json(env, { ok: true, item: data });
}
