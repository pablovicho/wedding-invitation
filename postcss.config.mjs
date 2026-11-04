/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    // prefijo -webkit- para Safari iOS (backdrop-filter, mask, etc.)
    autoprefixer: {},
  },
};

export default config;
