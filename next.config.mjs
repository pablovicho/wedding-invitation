/**
 * Static export. BASE_PATH dipakai kalau situs di-host di sub-folder,
 * mis. GitHub Pages "https://user.github.io/wedding-invitation" -> BASE_PATH=/wedding-invitation.
 * Untuk Netlify / Vercel / Cloudflare Pages / domain sendiri biarkan kosong.
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
