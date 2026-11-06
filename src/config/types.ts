export type ThemeName = 'samudra' | 'jati' | 'gading' | 'priangan' | 'taman' | 'langit';
export type TimeZone = 'WIB' | 'WITA' | 'WIT';

export interface Person {
  /** Apodo, se muestra en grande en la portada */
  nickname: string;
  /** Nombre completo + títulos */
  fullName: string;
  /** Ruta en public/private o URL absoluta, ej. '/private/couple/groom.webp' */
  photo: string;
  /** Ej. 'Primer hijo de' / 'Segunda hija de' */
  /** Usuario de Instagram sin @ (opcional) */
  instagram?: string;
}

/** Color del dress code: '#7F9DC2' o { hex: '#7F9DC2', name: 'Dusty Blue' } */
export type DressColor = string | { hex: string; name: string };

export interface DressCode {
  /** Déjalo vacío para usar la nota predeterminada del tema */
  note?: string;
  /** 'theme' = sigue automáticamente el tema activo, o completa tu propia lista de colores */
  colors: 'theme' | DressColor[];
}

export interface WeddingEvent {
  title: string;
  /** Formato YYYY-MM-DD */
  date: string;
  /** Formato HH:mm (24 horas) */
  start: string;
  /** Formato HH:mm, o déjalo vacío para "Selesai" */
  end?: string;
  venue: string;
  address: string;
  /** Link Google Maps (Share -> Copy link) */
  mapsUrl?: string;
  note?: string;
  /** Dress code específico de este evento (opcional), reemplaza el dress code general */
  dressCode?: DressCode;
}

export interface GiftAccount {
  type: 'bank' | 'ewallet';
  provider: string;
  number: string;
  holder: string;
  /** Ruta del logo (opcional) */
  logo?: string;
}

export interface WeddingConfig {
  /**
   * Tema de la invitación (fijo, igual para todos los invitados):
   * 'samudra' azul · 'jati' marrón · 'gading' crema · 'priangan' granate-dorado sundanés · 'taman' salvia · 'langit' azul marino nocturno
   */
  theme: ThemeName;
  /**
   * false (recomendado): los invitados siempre ven el tema de arriba, se ignoran los enlaces ?theme=.
   * true: el tema se puede probar en el sitio en línea mediante ?theme=jati&preview (para conversar con la pareja).
   * Al ejecutar `npm run dev` el selector de temas siempre está disponible.
   */
  allowThemePreview: boolean;

  site: {
    /** URL final después del despliegue, sin barra al final. Obligatorio para la vista previa de la imagen en WhatsApp. */
    url: string;
    description: string;
    /** Imagen de vista previa cuando se comparte el enlace (1200x630) */
    ogImage: string;
    /** false = pedir a Google que no indexe la invitación (privacidad) */
    indexable: boolean;
  };

  timezone: TimeZone;

  couple: {
    /** Orden de aparición de los nombres */
    order: 'bride-first' | 'groom-first';
    bride: Person;
    groom: Person;
    hashtag?: string;
  };

  /** Foto de fondo de la portada y del panel izquierdo en escritorio */
  coverImage: string;
  /** Foto principal en la sección hero (marco arqueado) */
  heroImage: string;

  events: WeddingEvent[];

  /** Dress code general; eliminar para ocultar */
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
    /** Enlace de video preboda de YouTube (opcional) */
    youtube?: string;
  };

  liveStream: {
    enabled: boolean;
    platform: string;
    url: string;
  };

  rsvp: {
    enabled: boolean;
    /** Número de WhatsApp del destinatario de la confirmación, puede usar el formato 08xx / +628xx */
    whatsapp: string;
    maxGuests: number;
    /** Fecha límite de confirmación, formato YYYY-MM-DD (opcional) */
    deadline?: string;
  };

  /** Mensajes y oraciones — requiere env de Supabase, se oculta automáticamente si no está configurado */
  wishes: {
    enabled: boolean;
    pageSize: number;
  };

  gift: {
    enabled: boolean;
    /** true (recomendado): las cuentas se ocultan primero, el invitado toca la pila de tarjetas para abrirlas. false: se muestran directamente. */
    collapsed: boolean;
    accounts: GiftAccount[];
    address?: { recipient: string; phone?: string; address: string };
  };

  music: {
    enabled: boolean;
    src: string;
    title?: string;
  };

  /** Guarda RSVP, mensajes y check-in en Google Sheets (ver README). Deja la url vacía para desactivarlo. */
  googleSheets: {
    url: string;
  };

  /** QR personal para el invitado (requiere el enlace ?to=Nombre) + página /checkin/ para el recepcionista */
  checkin: {
    enabled: boolean;
  };

  /** El invitado puede crear fotos con el marco de la invitación para IG Story */
  photobooth: {
    enabled: boolean;
    hashtag?: string;
  };

  effects: {
    /** Portada en forma de sobre 3D con sello de cera */
    envelope: boolean;
    /** Estallido de adornos al tocar la pantalla */
    tapBurst: boolean;
    /** Adornos en movimiento al hacer scroll + foto inclinada según la inclinación del móvil */
    parallax: boolean;
  };

  copy: {
    coverLabel: string;
    /** Saludo en lengua regional en la portada, ej. 'Wilujeng Sumping' (opcional) */
    localGreeting?: string;
    coverTo: string;
    coverButton: string;
    coverNote: string;
    opening: string;
    closing: string;
    /** Agradecimiento en lengua regional, ej. 'Hatur nuhun' (opcional) */
    localThanks?: string;
  };
}
