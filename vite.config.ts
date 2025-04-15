import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import webfontDownload from 'vite-plugin-webfont-dl';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    webfontDownload([
      'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Montserrat:wght@300..800&display=swap',
    ]),
    Sitemap({
      hostname: 'https://raspberry.blue',
      generateRobotsTxt: true,
      robots: [{ userAgent: '*', allow: '/' }],
    }),
  ],
  base: '/',
});
