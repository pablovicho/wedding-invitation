import type { Config } from 'tailwindcss';

// Todos los colores se toman de variables CSS del tema (ver src/themes/*.css),
// así que cambiar de tema = cambiar un solo atributo data-theme en <html>.
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;
const shade = (name: string) => `rgb(var(--color-shades-${name}) / <alpha-value>)`;

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        ink: token('ink'),
        muted: token('muted'),
        primary: token('primary'),
        'on-primary': token('on-primary'),
        accent: token('accent'),
        line: token('line'),
        shades: {
          100: shade('100'),
          200: shade('200'),
          300: shade('300'),
          400: shade('400'),
          500: shade('500'),
          600: shade('600'),
          700: shade('700'),
          800: shade('800'),
          900: shade('900'),
        },
      },
      fontFamily: {
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        script: ['var(--font-script)', 'cursive'],
        arabic: ['var(--font-arabic)', 'serif'],
      },
      maxWidth: {
        phone: '30rem',
      },
      keyframes: {
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 8s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
        'float-y': 'float-y 3s ease-in-out infinite',
        sway: 'sway 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
