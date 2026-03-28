import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// VITE_GEMINI_API_KEY is automatically exposed to the browser via import.meta.env
// when set as an Environment Variable in Vercel (or in a local .env file).
// No special "define" block needed — just add VITE_GEMINI_API_KEY to your Vercel project settings.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
