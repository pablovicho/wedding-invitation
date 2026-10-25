# Digital Wedding Invitation

A static (serverless) Islamic wedding invitation website, built **mobile-first** because nearly every guest opens it from a WhatsApp link on Android or iPhone. It ships with 6 themes, each with its own SVG ornaments and animations, and everything is configured from **a single config file**.

Built with Next.js 16 (static export), React 19, Tailwind CSS 3, and Motion. The guest-facing copy is in Indonesian (with optional Sundanese touches) and can be edited in the config.

This repo can stay public: your real data (names, phone numbers, bank accounts, photos) **is never committed**. See [Personal data & privacy](#personal-data--privacy).

---

## Table of contents

1. [Features](#features)
2. [Quick start](#quick-start)
3. [Personal data & privacy](#personal-data--privacy)
4. [Filling in the config](#filling-in-the-config)
5. [Themes & dress code](#themes--dress-code)
6. [Photos, music & WhatsApp preview](#photos-music--whatsapp-preview)
7. [Personal links for each guest](#personal-links-for-each-guest)
8. [RSVP & wishes: Google Sheets or Supabase](#rsvp--wishes-google-sheets-or-supabase)
9. [QR check-in on the wedding day](#qr-check-in-on-the-wedding-day)
10. [Photobooth](#photobooth)
11. [Effects & animations](#effects--animations)
12. [Deploying to Cloudflare Pages + a subdomain](#deploying-to-cloudflare-pages--a-subdomain)
13. [Pre-launch checklist](#pre-launch-checklist)
14. [Device compatibility](#device-compatibility)
15. [Project structure & advanced customization](#project-structure--advanced-customization)
16. [Troubleshooting](#troubleshooting)

---

## Features

**Invitation content**

- Cover designed as a **3D envelope with a wax seal** bearing the couple's monogram; the guest's name is written on the envelope.
- Bismillah, QS. Ar-Rum: 21 (Arabic text and translation), opening greeting, and the *barakallahu lakuma* prayer.
- Couple profiles: photo, full name, parents, and Instagram.
- Countdown with **add to calendar** buttons: Google Calendar, plus an .ics file for iPhone/Outlook that includes a reminder one day before.
- Events (*akad*, *resepsi*, and as many more as you need) with a Google Maps button and **dress code, either general or per event**.
- Love story timeline, swipeable gallery lightbox, and an optional YouTube video.
- Live streaming (optional).
- **RSVP via WhatsApp**, also logged to Google Sheets.
- **Wishes & prayers** guest book stored in Google Sheets or Supabase.
- **Digital gift envelope**: bank and e-wallet cards that guests reveal with a tap, one-tap copy for account numbers, and an optional gift delivery address.
- Closing section with the families' names and a thank-you note (optionally in a regional language, e.g. Sundanese *Hatur nuhun*).

**Interactive features**

- **Guest QR card**: every guest with a personal link gets a QR code they can save as an image.
- **`/checkin/` page** for the reception desk: scan QR codes with a phone camera, track attendance, and export to CSV.
- **Photobooth**: guests pick or take a photo, which is automatically framed in the theme (Story 9:16 or Feed 4:5) and ready to share.
- **Link generator** at `/generator/`: paste your guest list and get personal links plus ready-to-send WhatsApp messages.

**Look & feel**

- 6 themes: Samudra (blue), Jati (brown), Gading (cream), Priangan (Sundanese maroon & gold), Taman (sage), and Langit (midnight navy).
- Themed particles (petals, jasmine, leaves, stars), a burst of ornaments wherever the screen is tapped, parallax, and a hero photo that tilts as the phone tilts.
- West Javanese motifs in the Priangan theme: *siger* crown, jasmine strands (*ronce melati*), *kawung* batik, *gunungan* (wayang golek), and *mega mendung* clouds.
- Background music with a vinyl-record button; it pauses automatically when guests switch apps.
- App-style bottom navigation that follows the actual section order, safe for iPhone notches and home bars.
- On desktop: large photo on the left, invitation on the right.
- Respects the phone's *reduce motion* setting.

---

## Quick start

Requires **Node.js 22 or newer**.

```bash
npm install
npm run dev          # open http://localhost:3000
```

On first run, `src/config/wedding.config.ts` is created automatically from the example (`wedding.config.example.ts`). **Put your real data in `wedding.config.ts`.**

Also try:

- `http://localhost:3000/?to=Bapak%20Ahmad`: cover with a guest name
- `http://localhost:3000/generator/`: guest link generator
- `http://localhost:3000/checkin/`: check-in scanner

| Command | What it does |
| --- | --- |
| `npm run dev` | Development mode (theme palette switcher available) |
| `npm run build` | Static build into `out/` |
| `npm start` | Serve `out/` locally for a final check |
| `npm run deploy` | Check the config, build, and upload to Cloudflare Pages with wrangler ([details](#deploying-to-cloudflare-pages--a-subdomain)) |
| `npm run build:upload` | Check the config and build into `out/` for a manual upload through the Cloudflare dashboard |
| `npm run images` | Compress photos in `public/images` and `public/private` |
| `npm run lint` / `npm run typecheck` | Code checks |

---

## Personal data & privacy

The repo is **public**, so real data is kept separate from the code:

| What | Where | Committed to GitHub? |
| --- | --- | --- |
| Code & themes | `src/`, `scripts/`, … | Yes |
| Example config (fake data) | `src/config/wedding.config.example.ts` | Yes |
| **Your real config** | `src/config/wedding.config.ts` | **No** (`.gitignore`) |
| **Personal photos** (prewedding, couple, og.jpg) | `public/private/…` | **No** (`.gitignore`) |
| Supabase key (optional) | `.env.local` | **No** (`.gitignore`) |

Because the repo does not contain your real data, the site is deployed **from your laptop** (`npm run deploy`), not from GitHub.

Keep in mind:

- **Back up** `src/config/wedding.config.ts` and `public/private/` (for example to Google Drive). There is no copy of them on GitHub.
- Before committing, run `git status`. None of the files above should appear. If they do, do not commit them.
- Anyone **with the link** can open the live site, and everything in the config is readable in its JavaScript files. The site is not indexed by Google (`indexable: false`), but that is not a security measure. So:
  - Listing bank and e-wallet numbers is normal, as on most invitations.
  - **Do not publish your full home address.** Leave `gift.address` empty and ask guests to contact you on WhatsApp instead.
  - Do not share the Google Sheet publicly. The Apps Script can still write to a private sheet.
  - After the wedding, disable the gift section (`gift.enabled: false`) and redeploy, or delete the Cloudflare project.
- **Old git history:** before this separation, older commits contained a phone number and an old Supabase URL and key (on the `gh-pages` branch). See [Cleaning old data out of git history](#cleaning-old-data-out-of-git-history).

---

## Filling in the config

All invitation content lives in **`src/config/wedding.config.ts`** (a local file that is not committed). Every field is documented in `src/config/types.ts`; in VS Code, hover over a field name to see its description.

| Section | Contents |
| --- | --- |
| `theme`, `allowThemePreview` | Invitation theme, and whether it can be previewed via the URL ([details](#themes--dress-code)) |
| `site` | Final URL, link preview description, OG image, and `indexable` (default `false`, hidden from Google) |
| `timezone` | `WIB`, `WITA`, or `WIT` (Indonesian time zones) |
| `couple` | Name order (`groom-first` / `bride-first`), both partners' details, hashtag |
| `coverImage`, `heroImage` | Cover/desktop background photo and the main arched photo |
| `events` | List of events: title, date `YYYY-MM-DD`, time `HH:mm`, venue, Maps link, note, event-specific dress code |
| `dressCode` | General dress code: `'theme'` (follow the theme) or custom colors |
| `quote` | Verse/quote and its translation |
| `story`, `gallery`, `liveStream` | Love story, gallery & YouTube video, live streaming (each has `enabled`) |
| `rsvp` | WhatsApp number that receives RSVPs (`08…` or `+62…`), max guests, RSVP deadline |
| `wishes` | Wishes & prayers guest book (needs Google Sheets or Supabase) |
| `gift` | Bank/e-wallet accounts, gift address, `collapsed` (cards revealed on tap; recommended) |
| `music` | Music file |
| `googleSheets` | Google Apps Script Web App URL |
| `checkin`, `photobooth`, `effects` | Interactive features & effects (each can be turned off) |
| `copy` | All text: greetings, opening, closing, family names, regional-language phrases |

To hide a feature, set `enabled: false`. Its section and navigation button disappear automatically.

---

## Themes & dress code

| Theme | Mood | Ornaments | Animation |
| --- | --- | --- | --- |
| `samudra` *(default)* | Dusty blue, semi-formal | Layered blue flowers, leaves, wave lines | Falling blue petals; cover wipes upward |
| `jati` | Earthy brown, boho | Pampas grass, boho rainbow arch, film grain | Drifting dried leaves; cover slides like a turning page |
| `gading` | Cream, minimalist editorial | Thin art-deco lines, initials monogram | Soft sparkles; cover fades out |
| `priangan` | Maroon & gold, formal Sundanese | *Siger*, jasmine strands, *kawung*, *gunungan*, *mega mendung* | Falling jasmine; cover opens upward |
| `taman` | Sage, botanical | Eucalyptus branches, mihrab arches | Drifting leaves; soft blur transitions |
| `langit` | Midnight navy, modern Gen-Z | Eight-pointed stars, swinging hanging crescents | Twinkling and shooting stars; circular cover reveal |

### Choosing a theme

```ts
theme: 'samudra',
allowThemePreview: false,
```

The theme in the config is **always the same for every guest**. To try other themes without guests seeing them:

- In `npm run dev`, use the palette button in the top-right corner, or open `http://localhost:3000/?theme=jati`.
- To preview on the live site (e.g. to decide together with your partner), set `allowThemePreview: true` and open `…/?theme=jati&preview`. **Set it back to `false` before sending the invitation.** While it is `false`, the `?theme=` parameter is ignored and the palette button never appears.

### Dress code

```ts
// Follow the active theme (its built-in palette & note)
dressCode: { colors: 'theme' },

// Custom: hex only, or with a color name
dressCode: {
  note: 'Sage & cream',
  colors: ['#EFEBDD', { hex: '#7D8F68', name: 'Sage' }],
},
```

You can also set a dress code **per event**: add `dressCode` inside an `events` item (e.g. white for the *akad*, theme colors for the reception). To hide the general dress code, remove the `dressCode` field.

---

## Photos, music & WhatsApp preview

1. Put personal photos in **`public/private/`** (this folder is not committed) and reference them in the config. For example, `public/private/gallery/photo-1.webp` is written as `'/private/gallery/photo-1.webp'`. The `public/images/` folder holds the committed example photos, so do not put real photos there.
2. Compress the photos so the invitation loads quickly on mobile data:
   ```bash
   npm run images -- --og public/private/gallery/favorite-photo.webp
   ```
   This resizes photos to at most 1600px, converts them to `.webp`, and creates **`public/private/og.jpg`** (1200×630), the image shown when the link is shared on WhatsApp. Then set `site.ogImage: '/private/og.jpg'` in the config. Original `.jpg`/`.png` files are not deleted; remove them yourself once the config points to the `.webp` files.
3. Music: replace `public/music/song1.mp3`, ideally under 4 MB. Music starts when the guest taps the wax seal (browsers do not allow audio before a user tap).
4. Set **`site.url`** to the final URL (e.g. `'https://undangan.febryan.web.id'`) so the WhatsApp preview shows the image.

---

## Personal links for each guest

Link format: `https://your-domain/?to=Guest%20Name`

The guest's name appears on the envelope, is pre-filled in the RSVP and wishes forms, and is used for the check-in QR card.

The easiest way is **`/generator/`**:

1. Open `https://your-domain/generator/`. This page is not indexed by Google and is not linked from the invitation.
2. Paste the guest list, one per line. Add a WhatsApp number after a comma to send directly:
   ```
   Bapak Ahmad & Keluarga
   Teh Rina, 081234567890
   ```
3. Adjust the message template if needed (`{nama}` and `{link}` are replaced automatically).
4. For each guest, click **Kirim WhatsApp** (send via WhatsApp) or **Salin pesan** (copy message).

---

## RSVP & wishes: Google Sheets or Supabase

RSVPs are **always** sent via WhatsApp to the number in `rsvp.whatsapp`. The backends below are optional; they log RSVPs, store wishes, and record check-ins. If neither is configured, the *Ucapan & Doa* (wishes) section is hidden automatically.

### Option A: Google Sheets (recommended: free and easy for family to read)

1. Create a new Google Sheet, then open **Extensions → Apps Script**.
2. Delete the contents of `Code.gs`, paste the entire [`scripts/google-apps-script.gs`](scripts/google-apps-script.gs), and click **Save**.
3. Click **Deploy → New deployment** and choose type **Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
4. Click **Deploy**, authorize access, and copy the **Web app URL** (ending in `/exec`).
5. Paste it into the config:
   ```ts
   googleSheets: { url: 'https://script.google.com/macros/s/XXXX/exec' },
   ```

The **Ucapan** (wishes), **RSVP**, and **CheckIn** tabs are created automatically when the first entry arrives. To remove an inappropriate wish, delete its row in the sheet. After editing the script, use **Deploy → Manage deployments → Edit → Version: New version**.

> The Web App URL is public (it is in the site's code). The script limits input length and blocks formula injection, but do not keep sensitive data in the same sheet.

### Option B: Supabase

Used when `googleSheets.url` is empty and the Supabase environment variables are set.

1. Create a project at [supabase.com](https://supabase.com) and run this in the *SQL Editor*:
   ```sql
   create table if not exists public.guest_book (
     id bigint generated always as identity primary key,
     name text not null check (char_length(name) between 1 and 60),
     message text not null check (char_length(message) between 1 and 500),
     created_at timestamptz not null default now()
   );
   alter table public.guest_book enable row level security;
   create policy "guests can read" on public.guest_book for select to anon using (true);
   create policy "guests can write" on public.guest_book for insert to anon with check (true);
   ```
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. This file is picked up by `npm run deploy`.

Supabase only handles wishes. RSVP logging and synced check-ins are only available with Google Sheets.

---

## QR check-in on the wedding day

**For guests:** when `checkin.enabled: true` and a guest opens their personal link (`?to=Name`), a **Kartu Tamu** (guest card) section appears with a QR code. Guests can save it as an image, which helps if the venue has poor signal.

**For the reception desk:**

1. Open `https://your-domain/checkin/` on the receptionist's phone. The site must be served over **https** for the camera to work; Cloudflare Pages provides https automatically.
2. Optionally enter the staff name, tap **Mulai Scan QR** (start scanning), and allow camera access.
3. Point the camera at a guest's QR code. The guest's name appears along with a vibration and a beep. Scanning the same guest twice shows an *already checked in* warning.
4. Guests without a QR code can be entered manually.
5. The list is stored on that phone (exportable to **CSV**). With Google Sheets enabled, it is also sent to the **CheckIn** tab, so several reception phones can work at the same time.

The scanner uses `BarcodeDetector` in Chrome on Android and the jsQR library on iPhone and other browsers.

### Where is check-in data stored?

- **Always in the browser of the scanning phone**, in `localStorage` under the key `checkin-log`. It is separate per device, per browser, and per site address. Test data on `http://localhost:3000` on your laptop does **not** carry over to the live site, and vice versa. No files are written to the project folder.
- **When `googleSheets.url` is set**, each check-in is also sent to the **CheckIn** tab. If the venue loses signal, entries are marked *belum sinkron* (not yet synced) and **retried automatically** when the connection returns (every 30 seconds).
- Data is lost if the browser's history or site data is cleared, or in incognito mode. On the wedding day, enable Google Sheets or tap **CSV** regularly.
- To clear test data, use the **"Hapus data check-in di HP ini"** (delete check-in data on this phone) button below the list, or DevTools → Application → Local Storage. Data in Google Sheets is not affected.

Check-ins recorded before Google Sheets was enabled are treated as local-only and are not sent later.

---

## Photobooth

The **Photobooth** section (`photobooth.enabled`) lets guests:

1. pick a photo from their gallery or take one,
2. choose **Story 9:16** or **Feed 4:5**,
3. get the photo in an arched frame with the theme's ornaments, the couple's names, the date, and the hashtag (`photobooth.hashtag`),
4. **share** it (straight to Instagram/WhatsApp via the phone's share menu) or **download** it.

Everything is processed on the guest's phone; photos are never uploaded anywhere.

---

## Effects & animations

```ts
effects: {
  envelope: true,   // 3D envelope cover with a wax seal (false = cover with a plain button)
  tapBurst: true,   // burst of ornaments where the screen is tapped
  parallax: true,   // ornaments move on scroll + hero photo tilts with the phone/mouse
},
```

- Background particles and reveal animations differ per theme automatically.
- On iPhone, tilt-with-the-phone needs motion sensor permission. It is requested automatically when the guest taps the wax seal; if denied, the photo simply stays still.
- If a guest has *Reduce motion* enabled on their phone, particles and effects are turned off automatically.

---

## Deploying to Cloudflare Pages + a subdomain

The invitation is uploaded **from your laptop** to Cloudflare Pages with `wrangler`, or alternatively through the Cloudflare dashboard. Cloudflare never needs to read the repo, so your real data never reaches GitHub. Everything is free: hosting, SSL, and unlimited bandwidth. Cloudflare also has servers in Jakarta, so the site is fast for guests in Indonesia.

This guide uses **`undangan.febryan.web.id`** as the example, for a domain whose **nameservers already point to Cloudflare** (`*.ns.cloudflare.com`). The root domain (`febryan.web.id`) can keep serving another project or repo: the invitation subdomain is a separate project and the two do not interfere.

### Step 1: Prepare your data

1. Fill in `src/config/wedding.config.ts` with real data.
2. Set `site.url: 'https://undangan.febryan.web.id'`.
3. Make sure `allowThemePreview: false`.
4. Put photos in `public/private/` and run `npm run images -- --og …` (see [Photos](#photos-music--whatsapp-preview)).
5. Check how it looks with `npm run dev`.

### Step 2: Log in to Cloudflare from your laptop (once)

```bash
npx wrangler@4 login
```

A browser window opens. Log in with the same Cloudflare account that manages your domain and click **Allow**.

### Step 3: Create the Pages project (once)

```bash
npx wrangler@4 pages project create undangan --production-branch=main
```

The name `undangan` becomes the temporary address `undangan.pages.dev`. If it is taken, pick another name such as `undangan-febryan` and deploy with `CF_PAGES_PROJECT=undangan-febryan npm run deploy`.

### Step 4: Deploy

```bash
npm run deploy
```

The script:
1. refuses to deploy if the config still contains the example data,
2. warns if `site.url` is empty or `allowThemePreview` is still `true`,
3. builds the site and uploads the `out/` folder to Cloudflare.

When it finishes, it prints a URL like `https://xxxx.undangan.pages.dev`. Open it to check the result.

**Whenever something changes** (data, photos, etc.), just run `npm run deploy` again.

<details>
<summary><b>Alternative: upload through the Cloudflare dashboard (no CLI)</b></summary>

1. Run `npm run build:upload`. It performs the same checks as `deploy` and builds into the `out/` folder, without uploading.
2. **First time (create the project):** go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → choose **Pages** → **Upload assets** (*Direct Upload*). If you land on a Workers page, look for the *"Looking to deploy Pages? Get started"* link. Enter the project name `undangan` → **Create project** → **drag & drop the `out` folder** → **Deploy site**. Make sure `index.html` is at the top level of the uploaded file list, not inside another folder.
3. **Later updates:** run `npm run build:upload` again, then go to project **undangan** → **Create deployment**, make sure *Production* is selected, drag & drop the `out` folder, and click **Save and Deploy**.

Dashboard upload limits: 1,000 files and 25 MB per file. This invitation is about 100 files and 10 MB. Projects created in the dashboard can also be updated with `npm run deploy`, and vice versa.

</details>

### Step 5: Connect the `undangan.febryan.web.id` subdomain (once)

1. Open [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → select project **undangan**.
2. Open the **Custom domains** tab → **Set up a custom domain**.
3. Enter `undangan.febryan.web.id` → **Continue** → **Activate domain**.
4. Cloudflare automatically creates the DNS record `CNAME undangan → undangan.pages.dev` in the `febryan.web.id` zone, along with an SSL certificate. Nothing needs to change at your registrar (e.g. DomaiNesia), and you should **not** use its domain forwarding feature.
5. Wait until the status is **Active** (usually 1–10 minutes), then open `https://undangan.febryan.web.id`.

> If Cloudflare says a record already exists, check **febryan.web.id → DNS → Records** and make sure there is no other record named `undangan` (for example, a leftover from earlier experiments).

### Step 6 (optional): Lock `/checkin/` & `/generator/`

These pages should only be reachable by you and the reception staff. Use **Cloudflare Zero Trust → Access** (free for up to 50 users):

1. Go to **Zero Trust → Access → Applications → Add an application → Self-hosted**.
2. Application domain: `undangan.febryan.web.id` with path `checkin`. Add another entry for path `generator`.
3. Policy: **Allow**, Include → **Emails**, and list your email plus the reception staff's emails.
4. When they open these pages, they will be asked for a code sent to their email. The invitation itself stays open to guests without logging in.

### Other hosting

The `out/` folder can be hosted anywhere (Netlify, Vercel, your own server). For a sub-folder:

```bash
BASE_PATH=/undangan SITE_URL=https://example.com/undangan npm run build
```

GitHub Pages is not used: the repo only contains example data, so there is nothing useful to publish from it.

---

## Pre-launch checklist

- [ ] `git status` does not show `wedding.config.ts` or `public/private/` (real data is not being committed).
- [ ] `wedding.config.ts` and `public/private/` are backed up.
- [ ] All names, dates, times, addresses, and **Google Maps links** are correct.
- [ ] The RSVP WhatsApp number and bank account numbers have been double-checked.
- [ ] Example photos (silhouettes & stock) are replaced with photos in `public/private/`, and `npm run images -- --og …` has been run.
- [ ] `site.url` is set; send the link to yourself on WhatsApp to check the preview image.
- [ ] `allowThemePreview: false`.
- [ ] Tested on **both iPhone and Android**: open the envelope, music plays, add to calendar, copy an account number, send an RSVP.
- [ ] If using Google Sheets: send a test wish, check that it appears in the sheet, then delete the row.
- [ ] If using check-in: scan a QR code from another phone at `/checkin/`.

---

## Device compatibility

- Targets iOS 13+ and Android 7+, including the WhatsApp/Instagram in-app browsers. Tailwind 3 with `autoprefixer` was chosen on purpose (instead of Tailwind 4) so the layout still works on older phones.
- Screen height uses `svh` (with a `vh` fallback) so the browser address bar does not cut off the cover. The hero photo also shrinks on short screens so the names, date, and hashtag always fit on the first screen.
- Long names wrap and scale down to fit narrow screens (tested down to 320px wide).
- Copy buttons fall back to a legacy method in in-app browsers that block the clipboard.
- Dates always use the event's time zone, so guests abroad still see the correct date.

---

## Project structure & advanced customization

```
src/
├── config/
│   ├── wedding.config.ts      ← EDIT HERE (real data, not committed)
│   ├── wedding.config.example.ts ← committed example
│   └── types.ts               ← documentation for every field
├── themes/index.ts            ← theme list, address-bar color, particles, default dress codes
├── app/
│   ├── globals.css            ← colors & fonts per theme (CSS variables)
│   ├── layout.tsx             ← fonts, metadata, link preview
│   ├── page.tsx               ← order of the invitation sections
│   ├── generator/             ← guest link generator
│   └── checkin/               ← reception QR scanner
├── components/
│   ├── ornaments/             ← SVG ornaments per theme (+ jabar.tsx: gunungan & mega mendung)
│   ├── sections/              ← cover/envelope, hero, events, gallery, photobooth, RSVP, etc.
│   ├── ui/                    ← Reveal, Parallax, Tilt, icons, toast
│   ├── BottomNav.tsx          ← bottom navigation (follows the section order automatically)
│   ├── MusicPlayer.tsx, TapBurst.tsx, ThemeSwitcher.tsx
│   └── InvitationProvider.tsx ← theme, guest name, cover state
└── lib/                       ← dates/time zones, calendar, WhatsApp, clipboard, QR, Sheets, Supabase
public/
├── images/                    ← example photos (committed)
└── private/                   ← your real photos (not committed)
scripts/
├── deploy.mjs                 ← checks + build + upload to Cloudflare Pages
├── ensure-config.mjs          ← creates wedding.config.ts from the example if missing
├── optimize-images.mjs        ← photo compression
└── google-apps-script.gs      ← Google Sheets backend
```

**Reordering sections:** move the components in `src/app/page.tsx`. The bottom navigation follows automatically.

**Adding a theme:**

1. Copy one of the `[data-theme='…']` blocks in `src/app/globals.css` and change its colors and fonts.
2. Add the theme name to `ThemeName` (`src/config/types.ts`) and an entry in `src/themes/index.ts`.
3. Register its ornaments in `SETS` (`src/components/ornaments/index.tsx`). Existing ornaments can be reused.
4. Run `npm run typecheck`. TypeScript points out everything else that still needs a value, such as the animations in `Reveal.tsx`, `Cover.tsx`, and `TapBurst.tsx`.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| WhatsApp preview shows no image | Set `site.url`, make sure the `site.ogImage` file (e.g. `public/private/og.jpg`) exists, then share the link again. WhatsApp caches previews, so try adding `?v=2` to the link |
| `npm run deploy` fails: *not authenticated* | Run `npx wrangler@4 login` |
| `npm run deploy` fails: *project not found* | Create the project first (Step 3), or set `CF_PAGES_PROJECT` to your project name |
| 404 or broken layout after a dashboard upload | The parent folder was probably uploaded instead of the contents of `out/`. Upload again and make sure `index.html` is at the top level |
| Subdomain does not load | Check *Custom domains* (status must be **Active**) and the `CNAME undangan` record in Cloudflare DNS. The nameservers at your registrar must remain `*.ns.cloudflare.com` |
| Photos missing after deploy | Paths in the config must start with `/private/…` or `/images/…` (without `public`), and file names must match exactly, including upper/lower case |
| Check-in test data from localhost is missing on the live site | They are intentionally separate (see [Where is check-in data stored?](#where-is-check-in-data-stored)) |
| Music does not play on iPhone | Make sure the silent switch is off. Music only starts after the wax seal is tapped |
| Wishes do not appear | Check the Web App URL (must end in `/exec`) and that access is *Anyone*. After editing the script, deploy a **New version** |
| Check-in camera does not open | The site must be https and camera permission granted. On iPhone, open it in Safari, not an in-app browser |
| `?theme=` does not change the theme | Intended when `allowThemePreview: false`. Use `npm run dev` to try themes |

### Cleaning old data out of git history

Old commits contained a phone number and a Supabase key. To keep them from being visible in the repo:

1. **Delete the `gh-pages` branch** (old build output): `git push origin --delete gh-pages`. Then in GitHub **Settings → Pages**, disable Pages or switch the source to *GitHub Actions*.
2. **Old Supabase project:** delete it if you no longer use it. If you still use it, make sure RLS is enabled.
3. **Scrub the number from `main`'s history** with [git-filter-repo](https://github.com/newren/git-filter-repo):
   ```bash
   echo 'REDACTED==>08xxxxxxxxx' > /tmp/replace.txt
   git filter-repo --replace-text /tmp/replace.txt
   git push --force --all
   ```
   This rewrites every commit (all hashes change). Existing forks are **not** cleaned, and copies others have already cloned cannot be recalled. If the data is truly sensitive, treat it as already exposed (e.g. watch that number for spam).

---

## License

MIT
