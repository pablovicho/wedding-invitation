/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    // -webkit- prefix untuk Safari iOS (backdrop-filter, mask, dll)
    autoprefixer: {},
  },
};

export default config;
