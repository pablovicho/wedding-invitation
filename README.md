# Undangan Pernikahan Digital

Website undangan pernikahan islami yang statis (tanpa server), dibuat **mobile-first** karena hampir semua tamu membukanya dari link WhatsApp di Android atau iPhone. Ada 6 tema dengan ornamen SVG dan animasi masing-masing. Semua isi diatur dari **satu file config**.

Dibangun dengan Next.js 16 (static export), React 19, Tailwind CSS 3, dan Motion.

---

## Daftar isi

1. [Fitur](#fitur)
2. [Mulai cepat](#mulai-cepat)
3. [Mengisi config](#mengisi-config)
4. [Tema & dress code](#tema--dress-code)
5. [Foto, musik & preview WhatsApp](#foto-musik--preview-whatsapp)
6. [Link personal untuk tiap tamu](#link-personal-untuk-tiap-tamu)
7. [RSVP & ucapan: Google Sheets atau Supabase](#rsvp--ucapan-google-sheets-atau-supabase)
8. [QR check-in di hari H](#qr-check-in-di-hari-h)
9. [Photobooth](#photobooth)
10. [Efek & animasi](#efek--animasi)
11. [Deploy](#deploy)
12. [Checklist sebelum undangan disebar](#checklist-sebelum-undangan-disebar)
13. [Kompatibilitas HP](#kompatibilitas-hp)
14. [Struktur project & kustomisasi lanjutan](#struktur-project--kustomisasi-lanjutan)
15. [Troubleshooting](#troubleshooting)

---

## Fitur

**Isi undangan**

- Cover berbentuk **amplop 3D dengan segel lilin** bermonogram inisial mempelai, dan nama tamu tertulis di amplop.
- Bismillah, QS. Ar-Rum: 21 (teks Arab dan terjemahan), salam pembuka, dan doa *barakallahu lakuma*.
- Profil mempelai: foto, nama lengkap, orang tua, dan Instagram.
- Countdown, plus tombol **simpan ke kalender** (Google Calendar, dan file .ics untuk iPhone/Outlook yang sudah berisi pengingat H-1).
- Acara (bisa lebih dari 2) dengan tombol Google Maps dan **dress code umum maupun per acara**.
- Kisah cinta (timeline), galeri dengan lightbox yang bisa di-swipe, dan video YouTube opsional.
- Live streaming (opsional).
- **RSVP lewat WhatsApp**, sekaligus tercatat di Google Sheets.
- **Ucapan & doa** yang tersimpan di Google Sheets atau Supabase.
- **Amplop digital** berbentuk kartu ATM/e-wallet (salin sekali ketuk), plus alamat kirim kado.
- Penutup berisi daftar keluarga dan ucapan terima kasih (bisa memakai bahasa daerah, misalnya *Hatur nuhun*).

**Fitur interaktif**

- **Kartu QR tamu**: setiap tamu dengan link personal mendapat QR yang bisa disimpan sebagai gambar.
- **Halaman `/checkin/`** untuk penerima tamu: scan QR pakai kamera HP, rekap kehadiran, dan ekspor CSV.
- **Photobooth**: tamu memilih atau memotret foto, lalu foto otomatis dibingkai sesuai tema (Story 9:16 atau Feed 4:5) dan siap dibagikan.
- **Generator link** di `/generator/`: tempel daftar tamu, lalu dapatkan link personal dan pesan WhatsApp siap kirim.

**Tampilan & animasi**

- 6 tema: Samudra (biru), Jati (coklat), Gading (krem), Priangan (marun-emas Sunda), Taman (sage), dan Langit (navy malam).
- Partikel bertema (kelopak, melati, daun, bintang), semburan ornamen saat layar diketuk, parallax, dan foto yang miring mengikuti kemiringan HP.
- Motif Jawa Barat di tema Priangan: siger, ronce melati, kawung, gunungan wayang golek, dan mega mendung.
- Musik latar dengan tombol piringan hitam; musik berhenti sendiri saat tamu pindah aplikasi.
- Navigasi bawah ala aplikasi, aman untuk notch dan home bar iPhone.
- Di laptop: foto besar di kiri, undangan di kanan.
- Menghormati setelan *kurangi gerakan* di HP.

---

## Mulai cepat

Butuh **Node.js 20.9 atau lebih baru**.

```bash
npm install
npm run dev          # buka http://localhost:3000
```

Coba juga:

- `http://localhost:3000/?to=Bapak%20Ahmad`: cover dengan nama tamu
- `http://localhost:3000/generator/`: generator link tamu
- `http://localhost:3000/checkin/`: pemindai check-in

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Mode pengembangan (tombol palet ganti tema tersedia) |
| `npm run build` | Build static ke folder `out/` |
| `npm start` | Menyajikan `out/` secara lokal untuk dicek |
| `npm run images` | Kompres foto di `public/images` |
| `npm run lint` / `npm run typecheck` | Pemeriksaan kode |

---

## Mengisi config

Semua isi undangan ada di **`src/config/wedding.config.ts`**. Penjelasan setiap field ada di `src/config/types.ts` (di VS Code, arahkan kursor ke nama field untuk melihat penjelasannya).

| Bagian | Isi |
| --- | --- |
| `theme`, `allowThemePreview` | Tema undangan, dan apakah tema boleh dicoba lewat URL ([detail](#tema--dress-code)) |
| `site` | URL final, deskripsi untuk preview link, gambar OG, dan `indexable` (default `false`, tidak muncul di Google) |
| `timezone` | `WIB`, `WITA`, atau `WIT` |
| `couple` | Urutan nama (`groom-first` / `bride-first`), data kedua mempelai, hashtag |
| `coverImage`, `heroImage` | Foto latar cover/panel desktop dan foto utama berbingkai lengkung |
| `events` | Daftar acara: judul, tanggal `YYYY-MM-DD`, jam `HH:mm`, tempat, link Maps, catatan, dress code khusus |
| `dressCode` | Dress code umum: `'theme'` (ikut tema) atau warna custom |
| `quote` | Ayat/kutipan beserta terjemahannya |
| `story`, `gallery`, `liveStream` | Kisah, galeri dan video YouTube, live streaming (masing-masing punya `enabled`) |
| `rsvp` | Nomor WhatsApp penerima (format `08…` atau `+62…`), maksimal jumlah tamu, batas konfirmasi |
| `wishes` | Ucapan & doa (butuh Google Sheets atau Supabase) |
| `gift` | Rekening/e-wallet dan alamat kirim kado |
| `music` | File musik |
| `googleSheets` | URL Web App Google Apps Script |
| `checkin`, `photobooth`, `effects` | Fitur interaktif & efek (bisa dimatikan satu per satu) |
| `copy` | Semua teks: sapaan, salam, pembuka, penutup, daftar keluarga, bahasa daerah |

Fitur yang tidak dipakai cukup diberi `enabled: false`. Section dan tombol navigasinya akan hilang otomatis.

---

## Tema & dress code

| Tema | Nuansa | Ornamen | Animasi |
| --- | --- | --- | --- |
| `samudra` *(default)* | Biru dusty blue, semi-formal | Bunga biru bertumpuk, daun, garis ombak | Kelopak biru berjatuhan; cover tersingkap ke atas |
| `jati` | Coklat earthy boho | Rumput pampas, pelangi lengkung, film grain | Daun kering melayang; cover bergeser seperti halaman buku |
| `gading` | Krem, minimalis editorial | Garis art-deco tipis, monogram inisial | Kilau halus; cover memudar |
| `priangan` | Marun-emas, formal Sunda klasik | Siger, ronce melati, kawung, gunungan, mega mendung | Melati berjatuhan; cover terbuka ke atas |
| `taman` | Sage, botanical | Ranting eucalyptus, lengkung mihrab | Daun melayang; transisi blur lembut |
| `langit` | Navy malam, modern Gen-Z | Bintang segi-8, bulan sabit gantung yang berayun | Bintang berkelip & bintang jatuh; cover terbuka melingkar |

### Memilih tema

```ts
theme: 'samudra',
allowThemePreview: false,
```

Tema dari config **selalu sama untuk semua tamu**. Untuk mencoba tema lain tanpa terlihat tamu:

- Saat `npm run dev`, klik tombol palet di kanan atas, atau buka `http://localhost:3000/?theme=jati`.
- Supaya bisa dicoba di situs online (misalnya untuk diskusi dengan pasangan), set `allowThemePreview: true` lalu buka `…/?theme=jati&preview`. **Kembalikan ke `false` sebelum undangan disebar.** Selama `false`, parameter `?theme=` diabaikan dan tombol palet tidak pernah muncul.

### Dress code

```ts
// Ikut tema aktif (palet & catatan bawaan tema)
dressCode: { colors: 'theme' },

// Custom: hex saja, atau dengan nama warna
dressCode: {
  note: 'Nuansa sage & krem',
  colors: ['#EFEBDD', { hex: '#7D8F68', name: 'Sage' }],
},
```

Dress code juga bisa diatur **per acara**. Isi `dressCode` di dalam item `events` (misalnya akad putih, resepsi mengikuti tema). Untuk menyembunyikan dress code umum, hapus field `dressCode`.

---

## Foto, musik & preview WhatsApp

1. Taruh foto di `public/images/…` dan arahkan path-nya di config (contoh: `'/images/gallery/foto-1.webp'`).
2. Kompres foto supaya ringan dibuka pakai data seluler:
   ```bash
   npm run images -- --og public/images/gallery/foto-favorit.webp
   ```
   Perintah ini mengecilkan foto ke maksimal 1600px, mengubahnya ke `.webp`, dan membuat `public/images/og.jpg` (1200×630). Gambar inilah yang muncul saat link dibagikan di WhatsApp. File `.jpg`/`.png` asli tidak dihapus; setelah config menunjuk ke `.webp`, hapus sendiri file aslinya.
3. Musik: ganti `public/music/song1.mp3`, usahakan di bawah 4 MB. Musik mulai berbunyi saat tamu mengetuk segel amplop (aturan browser: musik tidak boleh berbunyi sebelum ada ketukan).
4. Isi **`site.url`** dengan URL final supaya preview WhatsApp menampilkan gambar. Kalau deploy lewat GitHub Actions di repo ini, URL terisi otomatis.

---

## Link personal untuk tiap tamu

Format link: `https://domain-kamu/?to=Nama%20Tamu`

Nama tamu akan muncul di amplop, terisi otomatis di form RSVP dan ucapan, dan dipakai untuk kartu QR check-in.

Cara termudah adalah lewat **`/generator/`**:

1. Buka `https://domain-kamu/generator/` (halaman ini tidak diindeks Google dan tidak ditautkan dari undangan).
2. Tempel daftar tamu, satu per baris. Tambahkan nomor WA setelah koma kalau ingin langsung mengirim:
   ```
   Bapak Ahmad & Keluarga
   Teh Rina, 081234567890
   ```
3. Ubah template pesan kalau perlu (`{nama}` dan `{link}` diganti otomatis).
4. Untuk tiap tamu, klik **Kirim WhatsApp** atau **Salin pesan**.

---

## RSVP & ucapan: Google Sheets atau Supabase

RSVP **selalu** dikirim lewat WhatsApp ke nomor di `rsvp.whatsapp`. Backend di bawah ini opsional, untuk mencatat RSVP, menyimpan ucapan, dan check-in. Kalau keduanya kosong, section *Ucapan & Doa* otomatis disembunyikan.

### Opsi A: Google Sheets (disarankan, gratis, mudah dibaca keluarga)

1. Buat Google Sheets baru, lalu buka menu **Extensions → Apps Script**.
2. Hapus isi `Code.gs`, tempel seluruh isi file [`scripts/google-apps-script.gs`](scripts/google-apps-script.gs), lalu **Save**.
3. Klik **Deploy → New deployment**, pilih type **Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
4. Klik **Deploy**, izinkan aksesnya, lalu salin **Web app URL** (berakhiran `/exec`).
5. Tempel URL itu di config:
   ```ts
   googleSheets: { url: 'https://script.google.com/macros/s/XXXX/exec' },
   ```

Tab **Ucapan**, **RSVP**, dan **CheckIn** dibuat otomatis saat data pertama masuk. Ucapan yang tidak pantas cukup dihapus barisnya di Sheets. Kalau script diubah, pilih **Deploy → Manage deployments → Edit → Version: New version**.

> URL Web App memang bersifat publik (ada di kode situs). Script sudah membatasi panjang isian dan mencegah *formula injection*, tapi jangan menyimpan data sensitif di sheet yang sama.

### Opsi B: Supabase

Dipakai kalau `googleSheets.url` kosong dan env Supabase diisi.

1. Buat project di [supabase.com](https://supabase.com), lalu jalankan SQL ini di *SQL Editor*:
   ```sql
   create table if not exists public.guest_book (
     id bigint generated always as identity primary key,
     name text not null check (char_length(name) between 1 and 60),
     message text not null check (char_length(message) between 1 and 500),
     created_at timestamptz not null default now()
   );
   alter table public.guest_book enable row level security;
   create policy "tamu bisa membaca" on public.guest_book for select to anon using (true);
   create policy "tamu bisa menulis" on public.guest_book for insert to anon with check (true);
   ```
2. Untuk lokal: salin `.env.example` menjadi `.env.local`, lalu isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Untuk GitHub Actions: isi repository secrets `SUPABASE_URL` dan `SUPABASE_KEY`.

Supabase hanya dipakai untuk ucapan. RSVP tambahan dan check-in tersinkron hanya tersedia lewat Google Sheets.

---

## QR check-in di hari H

**Untuk tamu:** kalau `checkin.enabled: true` dan tamu membuka link personal (`?to=Nama`), muncul section **Kartu Tamu** berisi QR. Tamu bisa menyimpannya sebagai gambar, berguna kalau sinyal di lokasi jelek.

**Untuk penerima tamu:**

1. Buka `https://domain-kamu/checkin/` di HP penerima tamu. Situs harus **https** supaya kamera bisa dipakai, dan GitHub Pages/Netlify/Vercel sudah https.
2. Isi nama petugas (opsional), lalu ketuk **Mulai Scan QR** dan izinkan kamera.
3. Arahkan kamera ke QR tamu. Nama tamu muncul disertai getar dan bunyi. Kalau tamu yang sama di-scan lagi, muncul peringatan *sudah check-in*.
4. Tamu tanpa QR bisa diketik manual.
5. Rekap tersimpan di HP itu (bisa diekspor ke **CSV**). Kalau Google Sheets aktif, rekap juga masuk ke tab **CheckIn**, sehingga beberapa HP penerima tamu bisa dipakai bersamaan.

Pemindai memakai `BarcodeDetector` di Chrome Android dan library jsQR di iPhone serta browser lain.

---

## Photobooth

Section **Photobooth** (`photobooth.enabled`) memungkinkan tamu:

1. memilih foto dari galeri atau langsung memotret,
2. memilih format **Story 9:16** atau **Feed 4:5**,
3. mendapatkan foto berbingkai lengkung dengan ornamen tema, nama mempelai, tanggal, dan hashtag (`photobooth.hashtag`),
4. **Bagikan** (langsung ke IG/WA lewat menu share HP) atau **Unduh**.

Semua diproses di HP tamu; foto tidak di-upload ke mana pun.

---

## Efek & animasi

```ts
effects: {
  envelope: true,   // cover amplop 3D + segel lilin (false = cover dengan tombol biasa)
  tapBurst: true,   // semburan ornamen di titik ketukan
  parallax: true,   // ornamen bergerak saat scroll + foto hero miring mengikuti HP/mouse
},
```

- Partikel latar dan gaya animasi muncul (*reveal*) otomatis berbeda per tema.
- Di iPhone, efek miring mengikuti HP memerlukan izin sensor gerak. Izin diminta otomatis saat tamu mengetuk segel; kalau ditolak, efeknya diam saja.
- Kalau tamu mengaktifkan *Kurangi gerakan / Reduce motion* di HP, partikel dan efek dimatikan otomatis.

---

## Deploy

Hasil `npm run build` adalah folder **`out/`** berisi file statis yang bisa di-host di mana saja.

### GitHub Pages (otomatis)

1. Push repo ke GitHub.
2. Buka **Settings → Pages → Source**, pilih **GitHub Actions**.
3. (Opsional) **Settings → Secrets → Actions**: isi `SUPABASE_URL` dan `SUPABASE_KEY` kalau memakai Supabase.
4. Setiap push ke `main` akan menjalankan build dan deploy otomatis lewat `.github/workflows/deploy.yml`. Base path (`/nama-repo`) dan URL situs diatur otomatis.

### Netlify / Vercel / Cloudflare Pages

- Build command: `npm run build`
- Output directory: `out`
- Jangan isi `BASE_PATH`.

### Sub-folder lain atau domain sendiri

```bash
BASE_PATH=/undangan SITE_URL=https://domainku.com/undangan npm run build
```

---

## Checklist sebelum undangan disebar

- [ ] Semua nama, tanggal, jam, alamat, dan **link Google Maps** sudah benar.
- [ ] Nomor WhatsApp RSVP dan nomor rekening sudah dicek dua kali.
- [ ] Foto contoh (siluet & stok) sudah diganti, lalu `npm run images -- --og …` sudah dijalankan.
- [ ] `site.url` terisi, lalu kirim link ke diri sendiri di WhatsApp untuk mengecek preview gambar.
- [ ] `allowThemePreview: false`.
- [ ] Sudah dicoba di **iPhone dan Android**: buka amplop, musik berbunyi, simpan ke kalender, salin rekening, RSVP terkirim.
- [ ] Kalau memakai Google Sheets: kirim satu ucapan percobaan, cek muncul di sheet, lalu hapus barisnya.
- [ ] Kalau memakai check-in: coba scan QR dari HP lain di `/checkin/`.

---

## Kompatibilitas HP

- Target: iOS 13+ dan Android 7+, termasuk in-app browser WhatsApp/Instagram. Tailwind 3 dengan `autoprefixer` sengaja dipilih (bukan Tailwind 4) supaya tampilan tetap benar di HP lama keluarga.
- Tinggi layar memakai `svh` (dengan fallback `vh`) supaya address bar tidak memotong cover.
- Tombol salin punya fallback untuk in-app browser yang memblokir clipboard.
- Tanggal selalu memakai zona waktu acara, jadi tamu di luar negeri tetap melihat tanggal yang benar.

---

## Struktur project & kustomisasi lanjutan

```
src/
├── config/
│   ├── wedding.config.ts      ← EDIT DI SINI
│   └── types.ts               ← penjelasan setiap field
├── themes/index.ts            ← daftar tema, warna address bar, partikel, dress code bawaan
├── app/
│   ├── globals.css            ← warna & font per tema (CSS variable)
│   ├── layout.tsx             ← font, metadata, preview link
│   ├── page.tsx               ← urutan section undangan
│   ├── generator/             ← generator link tamu
│   └── checkin/               ← pemindai QR penerima tamu
├── components/
│   ├── ornaments/             ← ornamen SVG per tema (+ jabar.tsx: gunungan & mega mendung)
│   ├── sections/              ← cover/amplop, hero, acara, galeri, photobooth, RSVP, dll.
│   ├── ui/                    ← Reveal, Parallax, Tilt, ikon, toast
│   ├── BottomNav.tsx          ← navigasi bawah (otomatis mengikuti urutan section)
│   ├── MusicPlayer.tsx, TapBurst.tsx, ThemeSwitcher.tsx
│   └── InvitationProvider.tsx ← tema, nama tamu, status cover
└── lib/                       ← tanggal/zona waktu, kalender, WhatsApp, clipboard, QR, Sheets, Supabase
scripts/
├── optimize-images.mjs        ← kompres foto
└── google-apps-script.gs      ← backend Google Sheets
```

**Mengubah urutan section:** pindahkan komponennya di `src/app/page.tsx`. Navigasi bawah ikut menyesuaikan sendiri.

**Menambah tema baru:**

1. Salin salah satu blok `[data-theme='…']` di `src/app/globals.css`, lalu ganti warna dan fontnya.
2. Tambahkan nama tema di `ThemeName` (`src/config/types.ts`) dan entrinya di `src/themes/index.ts`.
3. Daftarkan ornamennya di `SETS` (`src/components/ornaments/index.tsx`). Ornamen yang sudah ada boleh dipakai ulang.
4. Jalankan `npm run typecheck`. TypeScript akan menunjukkan bagian lain yang masih perlu diisi, seperti animasi di `Reveal.tsx`, `Cover.tsx`, dan `TapBurst.tsx`.

---

## Troubleshooting

| Masalah | Solusi |
| --- | --- |
| Preview WhatsApp tidak menampilkan gambar | Isi `site.url`, pastikan `public/images/og.jpg` ada, lalu bagikan ulang link-nya (WhatsApp menyimpan cache, jadi coba tambahkan `?v=2` di link) |
| Gambar tidak muncul setelah deploy di GitHub Pages | Pastikan *Pages → Source* = **GitHub Actions** (bukan branch), supaya `BASE_PATH` terisi |
| Musik tidak berbunyi di iPhone | Pastikan tombol silent/mute di sisi HP tidak aktif. Musik baru mulai setelah segel diketuk |
| Ucapan tidak muncul | Cek URL Web App (harus berakhiran `/exec`) dan akses *Anyone*. Setelah mengubah script, deploy **New version** |
| Kamera check-in tidak terbuka | Situs harus https dan izin kamera diberikan. Di iPhone, buka lewat Safari, bukan in-app browser |
| Tema tidak berubah dengan `?theme=` | Memang disengaja kalau `allowThemePreview: false`. Gunakan `npm run dev` untuk mencoba |

---

## Lisensi

MIT
