/**
 * Exportación estática. BASE_PATH se usa si el sitio se aloja en un subdirectorio,
 * p. ej. GitHub Pages "https://user.github.io/wedding-invitation" -> BASE_PATH=/wedding-invitation.
 * Para Netlify / Vercel / Cloudflare Pages / dominio propio déjalo vacío.
 */
const basePath = (process.env.BASE_PATH ?? '').replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  reactStrictMode: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
