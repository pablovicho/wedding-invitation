# México Localization & Task Tracker

> **Note:** `image.png` (if attached/shared) could not be read in this environment (image input not supported). If it contains requirements, add them below.

## General rules
- One small PR per task; do not touch unrelated files.
- Never print, log, or commit secret values.
- Ask before deleting anything.
- After each task run lint, type check, and build; report what was verified vs assumed.

## Audit/task status
- [x] **Task 1 — Secret and history audit (🔴)**: findings reported (env/dev.vars/.wrangler coverage, history scan for env/service-role/Turnstile/R2/Cloudflare tokens, deleted `public/` files, `wedding.config.ts` history). **Owner action:** rotate Supabase service key/related Supabase creds as applicable, Turnstile secret, R2/Cloudflare tokens; review old project exposure per README. No history changes made.
- [x] **Task 2 — Harden Apps Script (🟠)**: `scripts/google-apps-script.gs` hardened (Turnstile fail-closed + hostname check, remote verification outside lock, admin token rate-limit, generic errors, RSVP per-name limit 3, min 1 guest when attending, shared `RSVP_MAX_GUESTS`, wish/wishes retained). Deploy note documented. Included in PR #1.
- [ ] **Task 3 — Security headers and CSP (🟠)**: **UNDONE / deferred.** Draft `_headers` work was prepared locally but not pushed/opened as PR (remote push rejected by repository rules; decision deferred). To do: add `public/_headers` with HSTS, nosniff, referrer policy, permissions policy, CSP **Report-Only** first, then deploy/test all flows (seal, music, RSVP, photobooth, guest book, Turnstile) with zero console violations, switch to enforcing, verify with `curl -sI`. Review camera in `Permissions-Policy` for `/checkin`/photobooth before enforcing.
- [ ] **Task 4 — Content cleanup (🟠)**: remove template leftovers; full Spanish (es-MX) end-to-end; hide/real social handles; payment details locally appropriate without exposing full account numbers in shipped JS; `lang=es-MX`, `og:locale=es_MX`; translate remaining Indonesian aria-labels; fix persona/personas plural; no Indonesian strings in `src`/built HTML; no real account numbers in build output.
- [ ] **Task 5 — RSVP flow reliability (🟠)**: WhatsApp always works; sheet logging best-effort; remove Turnstile requirement from submit (only write when token exists if applicable per design); popup fallback; limit `?to=` to 60 chars; explicit attendance choice (owner decision); singular/plural; confirm `waLink` encoding; handle Turnstile error/expiry.
- [ ] **Task 6 — Guest book hardening (🟠)**: `functions/api/wish.ts` + new Supabase migration (do not edit applied migrations) + client: CORS/origin, Turnstile hostname+client IP, timeout/error handling, body size cap, code-point slicing, strip invisible/bidi chars, generic 503 on missing config, HTTP 429 for silent rate-limit drops (PGRST116), DB grants/policies/hidden column/trigger fixes (`search_path`, revoke execute, IPv6 /64, no xff fallback ordering issues), client shows server error text. Owner: separate Supabase project/secrets for Preview; `wrangler pages secret put`.
- [ ] **Task 7 — Review remaining unseen code (🟠)**: audit `src/lib/whatsapp.ts`, `src/components/ui/Turnstile.tsx`, guest book client, `InvitationProvider`, `src/config/wedding.config.*` (redact personal values), `.env.example`, `package.json`, `scripts/`, full `functions/api/`; check raw HTML/auto-linking, `NEXT_PUBLIC_*` usage, deploy script secrets/bucket visibility, other API endpoints; dependency audit + Next/React advisory check.
- [ ] **Task 8 — Accessibility and navigation polish (🟡)**: `#opening` anchor, relabel seal button, RSVP/gift in nav or persistent confirm button, unique gallery alt text/remove duplicate aria-labels, decorative empty alt, text size/contrast, reduced-motion.
- [ ] **Task 9 — Performance (🟡)**: dedupe flourish SVGs, responsive image widths/srcset/sizes with dimensions, visible hero in static HTML (opacity/transform animations), trim fonts, downscale/orient photobooth photos, cache headers for media, apple-touch icon, remove `playsInline` from audio if required.
- [ ] **Task 10 — Final verification pass**: live headers (site+media), empty POST `/api/wish` -> 400, guest book/RSVP end-to-end on real phone, `view-source` `lang="es-MX"`, no placeholder content.

## Localization sweep: Mexican Spanish & remove Indonesia/other-country artifacts
Search and adapt across `src/`, `public/`, `scripts/`, `functions/`, `supabase/`, config, README/docs as appropriate:

### Language & locale
- [ ] Replace remaining Indonesian strings/UI copy/aria-labels where user-facing with natural Mexican Spanish.
- [ ] Review Islamic/religious/regional content for MX context and consistency.
- [ ] Set/document `lang="es-MX"`, `og:locale="es_MX"`, Mexico date/time formatting (not WIB/WITA/WIT assumptions).
- [ ] Fix singular/plural ("persona/personas") and RSVP/guest text in Spanish.
- [ ] Verify all labels and accessibility names.

### Phone numbers & WhatsApp
- [ ] `src/lib/whatsapp.ts`: replace Indonesia normalization (`0/+62 -> 62`) with Mexico-appropriate normalization (`+52/52`, mobile rules as needed) and validate `wa.me` format.
- [ ] Remove/replace `081234567890`, `+62` placeholders in configs, generator defaults, examples, docs.
- [ ] Ensure `waLink` URL-encodes text and works with Mexican numbers.

### Timezones & dates
- [ ] Replace WIB/WITA/WIT assumptions with Mexico timezones as needed (e.g. `America/Mexico_City`, `America/Cancun`, `America/Tijuana`) and update UI/ICS handling.
- [ ] `src/lib/date.ts`, calendar/ICS: remove WIB-specific logic; ensure correct tz for Mexico.
- [ ] Replace Indonesian placeholder dates/venues/addresses in examples.

### Payments & gift section (Mexico)
- [ ] Replace Indonesian payment methods/examples (BSI, BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, DANA) with Mexico-relevant options (e.g. SPEI/CLABE, MX banks, Mercado Pago, CoDi, Spin by OXXO, PayPal — owner confirms).
- [ ] Replace/remove Indonesia-specific payment logos in `public/images/logos/` as needed (**ask before deleting assets**).
- [ ] Ensure gift/account labels fit Mexico and full account numbers are not exposed in shipped JS.
- [ ] Replace Indonesian address/phone formatting examples.

### Google Sheets / Apps Script artifacts
- [ ] Align sheet/tab/header names (Indonesian `Ucapan/Waktu/Nama` remnants) with Spanish/MX usage as appropriate; document manual rename for existing deployed sheets.
- [ ] Update README/docs for MX context where relevant.

### Config, examples, and docs
- [ ] `src/config/wedding.config.example.ts`: replace Indonesian placeholders with Mexican Spanish-neutral examples.
- [ ] `README.md`/docs: remove Indonesia-specific deployment/content assumptions where inaccurate.
- [ ] `src/app/generator/Generator.tsx`: MX phone/name examples.
- [ ] Search for `Indonesia`, `Bandung`, `Jakarta`, `Jawa`, `Sunda`, `Rp`, `IDR`, `.id`, `+62`, `WIB`.

### Build/output verification (when implemented)
- [ ] Search built output for Indonesian strings and real account numbers.
- [ ] Verify WhatsApp links, RSVP, guest book, calendar, and headers on deployed site (MX locale).
