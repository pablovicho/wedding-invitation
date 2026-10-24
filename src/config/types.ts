export type ThemeName = 'samudra' | 'jati' | 'gading' | 'priangan' | 'taman' | 'langit';
export type TimeZone = 'WIB' | 'WITA' | 'WIT';

export interface Person {
  /** Nama panggilan, tampil besar di cover */
  nickname: string;
  /** Nama lengkap + gelar */
  fullName: string;
  /** Path foto di folder public, mis. '/images/couple/groom.webp' */
  photo: string;
  /** Mis. 'Putra pertama dari' / 'Putri kedua dari' */
  childOrder: string;
  father: string;
  mother: string;
  /** Username Instagram tanpa @ (opsional) */
  instagram?: string;
}

/** Warna dress code: '#7F9DC2' atau { hex: '#7F9DC2', name: 'Dusty Blue' } */
export type DressColor = string | { hex: string; name: string };

export interface DressCode {
  /** Kosongkan untuk memakai catatan bawaan tema */
  note?: string;
  /** 'theme' = otomatis mengikuti tema aktif, atau isi daftar warna sendiri */
  colors: 'theme' | DressColor[];
}

export interface WeddingEvent {
  title: string;
  /** Format YYYY-MM-DD */
  date: string;
  /** Format HH:mm (24 jam) */
  start: string;
  /** Format HH:mm, atau kosongkan untuk "Selesai" */
  end?: string;
  venue: string;
  address: string;
  /** Link Google Maps (Share -> Copy link) */
  mapsUrl?: string;
  note?: string;
  /** Dress code khusus acara ini (opsional), menimpa dress code umum */
  dressCode?: DressCode;
}

export interface GiftAccount {
  type: 'bank' | 'ewallet';
  provider: string;
  number: string;
  holder: string;
  /** Path logo (opsional) */
  logo?: string;
}

export interface WeddingConfig {
  /**
   * Tema undangan (tetap, sama untuk semua tamu):
   * 'samudra' biru · 'jati' coklat · 'gading' krem · 'priangan' marun-emas Sunda · 'taman' sage · 'langit' navy malam
   */
  theme: ThemeName;
  /**
   * false (disarankan): tamu selalu melihat tema di atas, link ?theme= diabaikan.
   * true: tema bisa dicoba di situs online lewat ?theme=jati&preview (untuk diskusi dengan pasangan).
   * Saat `npm run dev` pemilih tema selalu tersedia.
   */
  allowThemePreview: boolean;

  site: {
    /** URL final setelah deploy, tanpa slash di akhir. Wajib untuk preview gambar di WhatsApp. */
    url: string;
    description: string;
    /** Gambar preview saat link dibagikan (1200x630) */
    ogImage: string;
    /** false = minta Google tidak mengindeks undangan (privasi) */
    indexable: boolean;
  };

  timezone: TimeZone;

  couple: {
    /** Urutan tampil nama */
    order: 'bride-first' | 'groom-first';
    bride: Person;
    groom: Person;
    hashtag?: string;
  };

  /** Foto latar cover & panel kiri di desktop */
  coverImage: string;
  /** Foto utama di bagian hero (bingkai lengkung) */
  heroImage: string;

  events: WeddingEvent[];

  /** Dress code umum; hapus untuk menyembunyikan */
  dressCode?: DressCode;

  quote: {
    arabic: string;
    translation: string;
    source: string;
  };

  story: {
    enabled: boolean;
    items: { date: string; title: string; description: string; image?: string }[];
  };

  gallery: {
    enabled: boolean;
    photos: { src: string; alt: string }[];
    /** Link YouTube video prewedding (opsional) */
    youtube?: string;
  };

  liveStream: {
    enabled: boolean;
    platform: string;
    url: string;
  };

  rsvp: {
    enabled: boolean;
    /** Nomor WhatsApp penerima konfirmasi, boleh format 08xx / +628xx */
    whatsapp: string;
    maxGuests: number;
    /** Batas konfirmasi, format YYYY-MM-DD (opsional) */
    deadline?: string;
  };

  /** Ucapan & doa — butuh env Supabase, otomatis tersembunyi kalau belum diset */
  wishes: {
    enabled: boolean;
    pageSize: number;
  };

  gift: {
    enabled: boolean;
    /** true (disarankan): rekening disembunyikan dulu, tamu mengetuk tumpukan kartu untuk membuka. false: langsung tampil. */
    collapsed: boolean;
    accounts: GiftAccount[];
    address?: { recipient: string; phone?: string; address: string };
  };

  music: {
    enabled: boolean;
    src: string;
    title?: string;
  };

  /** Simpan RSVP, ucapan & check-in ke Google Sheets (lihat README). Kosongkan url untuk mematikan. */
  googleSheets: {
    url: string;
  };

  /** QR pribadi untuk tamu (butuh link ?to=Nama) + halaman /checkin/ untuk penerima tamu */
  checkin: {
    enabled: boolean;
  };

  /** Tamu bisa membuat foto berbingkai undangan untuk IG Story */
  photobooth: {
    enabled: boolean;
    hashtag?: string;
  };

  effects: {
    /** Cover berupa amplop 3D dengan segel lilin */
    envelope: boolean;
    /** Semburan ornamen saat layar diketuk */
    tapBurst: boolean;
    /** Ornamen bergerak saat scroll + foto miring mengikuti kemiringan HP */
    parallax: boolean;
  };

  copy: {
    coverLabel: string;
    /** Sapaan bahasa daerah di cover, mis. 'Wilujeng Sumping' (opsional) */
    localGreeting?: string;
    coverTo: string;
    coverButton: string;
    coverNote: string;
    salam: string;
    opening: string;
    closing: string;
    closingSalam: string;
    /** Ucapan terima kasih bahasa daerah, mis. 'Hatur nuhun' (opsional) */
    localThanks?: string;
    familiesTitle: string;
    families: string[];
  };
}
