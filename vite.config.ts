import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import webfontDownload from 'vite-plugin-webfont-dl';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    webfontDownload([
      'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Montserrat:wght@300..800&display=swap',
    ]),
    Sitemap({
      hostname: 'https://raspberry.blue',
      // Only index the home page:
      dynamicRoutes: ['/'],
      exclude: ['/*'],
      changefreq: 'monthly',
      priority: 1.0,
      outDir: 'dist',
    }),
  ],
  base: '/',
});
