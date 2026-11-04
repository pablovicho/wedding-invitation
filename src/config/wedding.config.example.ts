import type { WeddingConfig } from './types';

/**
 * ============================================================
 *  EJEMPLO DE CONFIGURACIÓN (datos falsos) — este archivo se incluye en git.
 *
 *  Los datos reales están en `wedding.config.ts` (en la misma carpeta),
 *  que se genera automáticamente desde este archivo cuando se ejecuta `npm run dev` / `npm run build`
 *  y NO se incluyen en el control de versiones (ver .gitignore). Edita ese archivo, no este.
 *
 *  Las fotos personales deben colocarse en public/private/ (también no se incluyen en el control de versiones).
 * ============================================================
 */
export const wedding: WeddingConfig = {
  theme: 'samudra',
  allowThemePreview: false,

  site: {
    url: '',
    description: '¡Te invito a asistir a nuestra boda!',
    ogImage: '/images/og.jpg',
    indexable: false,
  },

  timezone: 'WIB',

  couple: {
    order: 'groom-first',
    groom: {
      nickname: 'Pablo',
      fullName: 'Pablo Valdés',
      photo: '/images/couple/groom.webp',
      instagram: 'username',
    },
    bride: {
      nickname: 'Marce',
      fullName: 'Marcela Martínez',
      photo: '/images/couple/bride.webp',
      instagram: 'username',
    },
    hashtag: '#MarceyPabloQuique',
  },

  coverImage: '/images/gallery/prewedding-5.webp',
  heroImage: '/images/gallery/prewedding-4.webp',

  events: [
    {
      title: 'Boda Civil',
      date: '2027-05-15',
      start: '08:00',
      end: '10:00',
      venue: 'Masjid Pusdai Jawa Barat',
      address: 'Jl. Diponegoro No.63, Cihaur Geulis, Kota Bandung',
      mapsUrl: 'https://maps.app.goo.gl/',
      note: 'Solo para familia y amigos cercanos',
      // Ejemplo de código de vestimenta específico para este evento:
      dressCode: { note: 'Blanco & blanco roto', colors: [{ hex: '#FFFFFF', name: 'Blanco' }, { hex: '#F3EEE4', name: 'Blanco Roto' }] },
    },
    {
      title: 'Recepción',
      date: '2027-05-15',
      start: '11:00',
      end: '14:00',
      venue: 'Gedung Serbaguna',
      address: 'Jl. Contoh No. 1, Kota Bandung',
      mapsUrl: 'https://maps.app.goo.gl/',
    },
  ],

  // colors: 'theme' = automáticamente sigue el tema. O personalizado, ejemplo:
  // colors: ['#F4F7FB', { hex: '#7F9DC2', name: 'Azul Desgastado' }]
  dressCode: {
    colors: 'theme',
  },

  quote: {
    arabic:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ',
    translation:
      'Y entre sus signos de poder, es que ha creado para ustedes esposas de su propio sexo, para que puedan vivir con ellas y ha puesto amor y bondad entre ustedes. Verdad, en eso está el testimonio para los que reflexionan.',
    source: 'QS. Ar-Rum : 21',
  },

  story: {
    enabled: false,
    items: [
      {
        date: 'Enero de 2024',
        title: 'Primera Reunión',
        description: 'Por la gracia de Dios, nos encontramos en una sesión de estudio en Bandung. Simple, pero eso fue el comienzo todo.',
        image: '/images/story/first-meet.webp',
      },
      {
        date: 'Agosto de 2025',
        title: "Conocimiento",
        description: 'Con buena intención y acompañado por la familia, comenzamos el proceso de conocerse.',
      },
      {
        date: 'Diciembre de 2026',
        title: 'Propuesta',
        description: 'Las dos familias se encontraron y acordaron. Bismillah, avanzamos al siguiente nivel.',
        image: '/images/gallery/moment-3.webp',
      },
    ],
  },

  gallery: {
    enabled: true,
    photos: [
      { src: '/images/gallery/prewedding-1.webp', alt: 'Fotografía preboda 1' },
      { src: '/images/gallery/moment-1.webp', alt: 'Fotografía preboda 2' },
      { src: '/images/gallery/prewedding-2.webp', alt: 'Fotografía preboda 3' },
      { src: '/images/gallery/prewedding-3.webp', alt: 'Fotografía preboda 4' },
      { src: '/images/gallery/prewedding-5.webp', alt: 'Fotografía preboda 5' },
      { src: '/images/gallery/moment-2.webp', alt: 'Fotografía preboda 6' },
      { src: '/images/gallery/prewedding-4.webp', alt: 'Fotografía preboda 7' },
      { src: '/images/gallery/moment-3.webp', alt: 'Fotografía preboda 8' },
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
      address: 'Jl. Contoh No. 1, RT 01/RW 02, Colonia Contoh, Distrito Contoh, Ciudad de México 40111',
    },
  },

  music: {
    enabled: true,
    src: '/music/song1.mp3',
    title: 'Fondo Sonoro',
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
    coverLabel: 'La Boda de',
    localGreeting: 'Bienvenido/a',
    coverTo: 'Estimado/a',
    coverButton: 'Abrir Invitación',
    coverNote: 'Por favor disculpe si hay algún error en la escritura del nombre o el título',
    opening:
      'Muy Sagrado Dios, que ha creado a sus criaturas en pares. Con la gracia y voluntad de Dios, queremos organizar la boda de nuestros hijos:',
    closing:
      'Es un honor y felicidad para nosotros si Estimado/a se presentan y brindan su bendición.',
    localThanks: 'Gracias',
    familiesTitle: 'Nuestra familia que está feliz',
    families: ['Familia Bapak Asep Sunandar & Madre Euis Rohaeti', 'Familia Bapak Ahmad Fauzi & Madre Siti Aminah'],
  },
};
