-- Endurece el libro de visitas (guest_book) de Supabase.
--
-- Cambios:
--  1. Los clientes anónimos ya NO pueden insertar directamente. Las altas pasan por el
--     endpoint `/api/wish` (Cloudflare Pages Function), que verifica Turnstile y usa service_role.
--  2. Lectura pública preservada (SELECT para anon/authenticated).
--  3. Validación de longitud también en la base de datos.
--  4. Límite de frecuencia del lado del servidor por IP, por nombre y global.
--
-- Aplicar con: supabase db push  (o pegar en el SQL Editor de Supabase)

create table if not exists public.guest_book (
  id bigint generated always as identity primary key,
  name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.guest_book enable row level security;

-- Lectura pública: comportamiento actual preservado.
drop policy if exists "guests can read" on public.guest_book;
create policy "guests can read" on public.guest_book
  for select to anon, authenticated
  using (true);

-- Sin INSERT directo: solo el endpoint /api/wish con service_role puede escribir.
drop policy if exists "guests can write" on public.guest_book;
revoke insert, update, delete on public.guest_book from anon, authenticated;
grant select on public.guest_book to anon, authenticated;

-- Límites de longitud. `not valid` permite aplicar la migración aunque existan filas
-- antiguas fuera de rango; las filas nuevas sí se validan.
alter table public.guest_book drop constraint if exists guest_book_name_len;
alter table public.guest_book add constraint guest_book_name_len
  check (char_length(btrim(name)) between 1 and 60) not valid;

alter table public.guest_book drop constraint if exists guest_book_message_len;
alter table public.guest_book add constraint guest_book_message_len
  check (char_length(btrim(message)) between 1 and 500) not valid;

create index if not exists guest_book_created_at_idx
  on public.guest_book (created_at desc);

-- Contadores de frecuencia. Nadie con anon/authenticated puede leer ni escribir esta tabla.
create table if not exists public.guest_book_rate_limit (
  key text primary key,
  window_start timestamptz not null default now(),
  hits integer not null default 0
);

alter table public.guest_book_rate_limit enable row level security;
revoke all on public.guest_book_rate_limit from anon, authenticated;

create index if not exists guest_book_rate_limit_window_idx
  on public.guest_book_rate_limit (window_start);

create or replace function public.enforce_guest_book_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  headers jsonb;
  ip text;
  bucket text;
  hits integer;
  now_ts timestamptz := clock_timestamp();
  win interval := interval '1 minute';
begin
  new.name := btrim(new.name);
  new.message := btrim(new.message);

  if char_length(new.name) not between 1 and 60
     or char_length(new.message) not between 1 and 500 then
    return null;
  end if;

  begin
    headers := nullif(current_setting('request.headers', true), '')::jsonb;
  exception when others then
    headers := null;
  end;

  ip := split_part(
    coalesce(headers->>'x-client-ip', headers->>'cf-connecting-ip', headers->>'x-forwarded-for', ''),
    ',',
    1
  );
  ip := btrim(ip);
  if ip = '' then
    ip := 'name:' || lower(new.name);
  end if;

  -- Límite global: evita que un script llene la tabla rápidamente.
  insert into public.guest_book_rate_limit as r (key, window_start, hits)
  values ('global', now_ts, 1)
  on conflict (key) do update set
    hits = case when r.window_start < now_ts - win then 1 else r.hits + 1 end,
    window_start = case when r.window_start < now_ts - win then now_ts else r.window_start end
  returning r.hits into hits;

  if hits > 120 then
    return null;
  end if;

  -- Límite por IP: 5 mensajes por minuto.
  bucket := 'ip:' || md5(ip);
  insert into public.guest_book_rate_limit as r (key, window_start, hits)
  values (bucket, now_ts, 1)
  on conflict (key) do update set
    hits = case when r.window_start < now_ts - win then 1 else r.hits + 1 end,
    window_start = case when r.window_start < now_ts - win then now_ts else r.window_start end
  returning r.hits into hits;

  if hits > 5 then
    return null;
  end if;

  -- Límite por nombre: 2 mensajes por minuto.
  bucket := 'name:' || md5(lower(new.name));
  insert into public.guest_book_rate_limit as r (key, window_start, hits)
  values (bucket, now_ts, 1)
  on conflict (key) do update set
    hits = case when r.window_start < now_ts - win then 1 else r.hits + 1 end,
    window_start = case when r.window_start < now_ts - win then now_ts else r.window_start end
  returning r.hits into hits;

  if hits > 2 then
    return null;
  end if;

  -- Limpieza barata de ventanas antiguas.
  delete from public.guest_book_rate_limit
  where window_start < now_ts - interval '1 day';

  return new;
end;
$$;

drop trigger if exists guest_book_rate_limit on public.guest_book;
create trigger guest_book_rate_limit
  before insert on public.guest_book
  for each row execute function public.enforce_guest_book_rate_limit();
