import type { WeddingConfig } from './types';

/**
 * ============================================================
 *  CONTOH CONFIG (data palsu) — file ini yang masuk ke git.
 *
 *  Data asli kamu ada di `wedding.config.ts` (di folder yang sama),
 *  yang dibuat otomatis dari file ini saat `npm run dev` / `npm run build`
 *  dan TIDAK ikut ter-commit (lihat .gitignore). Edit file itu, bukan ini.
 *
 *  Foto pribadi taruh di public/private/ (juga tidak ter-commit).
 * ============================================================
 */
export const wedding: WeddingConfig = {
  theme: 'samudra',
  allowThemePreview: false,

  site: {
    url: '',
    description: 'Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.',
    ogImage: '/images/og.jpg',
    indexable: false,
  },

  timezone: 'WIB',

  couple: {
    order: 'groom-first',
    groom: {
      nickname: 'Ryan',
      fullName: 'Febryan Ramadhan',
      photo: '/images/couple/groom.webp',
      childOrder: 'Putra pertama dari',
      father: 'Bapak Maman',
      mother: 'Ibu Tines Indrawati',
      instagram: 'username',
    },
    bride: {
      nickname: 'Nadia',
      fullName: 'Nadia Putri, S.Ds.',
      photo: '/images/couple/bride.webp',
      childOrder: 'Putri kedua dari',
      father: 'Bapak Ahmad Fauzi',
      mother: 'Ibu Siti Aminah',
      instagram: 'username',
    },
    hashtag: '#RakaNadiaHalalJourney',
  },

  coverImage: '/images/gallery/prewedding-5.webp',
  heroImage: '/images/gallery/prewedding-4.webp',

  events: [
    {
      title: 'Akad Nikah',
      date: '2027-05-15',
      start: '08:00',
      end: '10:00',
      venue: 'Masjid Pusdai Jawa Barat',
      address: 'Jl. Diponegoro No.63, Cihaur Geulis, Kota Bandung',
      mapsUrl: 'https://maps.app.goo.gl/',
      note: 'Khusus keluarga & kerabat dekat',
      // Contoh dress code khusus acara ini:
      dressCode: { note: 'Putih & broken white', colors: [{ hex: '#FFFFFF', name: 'Putih' }, { hex: '#F3EEE4', name: 'Broken White' }] },
    },
    {
      title: 'Resepsi',
      date: '2027-05-15',
      start: '11:00',
      end: '14:00',
      venue: 'Gedung Serbaguna',
      address: 'Jl. Contoh No. 1, Kota Bandung',
      mapsUrl: 'https://maps.app.goo.gl/',
    },
  ],

  // colors: 'theme' = otomatis mengikuti tema. Atau custom, contoh:
  // colors: ['#F4F7FB', { hex: '#7F9DC2', name: 'Dusty Blue' }]
  dressCode: {
    colors: 'theme',
  },

  quote: {
    arabic:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ',
    translation:
      'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
    source: 'QS. Ar-Rum : 21',
  },

  story: {
    enabled: true,
    items: [
      {
        date: 'Januari 2024',
        title: 'Pertama Bertemu',
        description: 'Atas izin Allah, kami dipertemukan di sebuah kajian di Bandung. Sederhana, tapi ternyata jadi awal segalanya.',
        image: '/images/story/first-meet.webp',
      },
      {
        date: 'Agustus 2025',
        title: "Ta'aruf",
        description: 'Dengan niat baik dan didampingi keluarga, kami memulai proses saling mengenal.',
      },
      {
        date: 'Desember 2026',
        title: 'Lamaran',
        description: 'Dua keluarga bertemu dan bersepakat. Bismillah, kami melangkah ke jenjang berikutnya.',
        image: '/images/gallery/moment-3.webp',
      },
    ],
  },

  gallery: {
    enabled: true,
    photos: [
      { src: '/images/gallery/prewedding-1.webp', alt: 'Foto prewedding 1' },
      { src: '/images/gallery/moment-1.webp', alt: 'Foto prewedding 2' },
      { src: '/images/gallery/prewedding-2.webp', alt: 'Foto prewedding 3' },
      { src: '/images/gallery/prewedding-3.webp', alt: 'Foto prewedding 4' },
      { src: '/images/gallery/prewedding-5.webp', alt: 'Foto prewedding 5' },
      { src: '/images/gallery/moment-2.webp', alt: 'Foto prewedding 6' },
      { src: '/images/gallery/prewedding-4.webp', alt: 'Foto prewedding 7' },
      { src: '/images/gallery/moment-3.webp', alt: 'Foto prewedding 8' },
    ],
    youtube: '',
  },

  liveStream: {
    enabled: false,
    platform: 'YouTube',
    url: 'https://youtube.com/live/',
  },

  rsvp: {
    enabled: true,
    whatsapp: '081234567890',
    maxGuests: 3,
    deadline: '2027-05-08',
  },

  wishes: {
    enabled: true,
    pageSize: 8,
  },

  gift: {
    enabled: true,
    collapsed: true,
    accounts: [
      { type: 'bank', provider: 'BSI', number: '1234567890', holder: 'Raka Pratama' },
      { type: 'bank', provider: 'BCA', number: '0987654321', holder: 'Nadia Putri' },
      { type: 'ewallet', provider: 'GoPay', number: '081234567890', holder: 'Raka Pratama', logo: '/images/logos/gopay.webp' },
    ],
    address: {
      recipient: 'Raka Pratama',
      phone: '081234567890',
      address: 'Jl. Contoh No. 1, RT 01/RW 02, Kel. Contoh, Kec. Contoh, Kota Bandung 40111',
    },
  },

  music: {
    enabled: true,
    src: '/music/song1.mp3',
    title: 'Backsound',
  },

  googleSheets: {
    url: '',
  },

  checkin: {
    enabled: true,
  },

  photobooth: {
    enabled: true,
    hashtag: '#RakaNadiaHalalJourney',
  },

  effects: {
    envelope: true,
    tapBurst: true,
    parallax: true,
  },

  copy: {
    coverLabel: 'The Wedding of',
    localGreeting: 'Wilujeng Sumping',
    coverTo: 'Kepada Yth. Bapak/Ibu/Saudara/i',
    coverButton: 'Buka Undangan',
    coverNote: 'Mohon maaf apabila ada kesalahan penulisan nama/gelar',
    salam: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    opening:
      'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:',
    closing:
      'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.',
    closingSalam: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
    localThanks: 'Hatur nuhun',
    familiesTitle: 'Kami yang berbahagia',
    families: ['Kel. Bapak Asep Sunandar & Ibu Euis Rohaeti', 'Kel. Bapak Ahmad Fauzi & Ibu Siti Aminah'],
  },
};
