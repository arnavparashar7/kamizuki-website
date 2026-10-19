// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/game/',
  build: {
    outDir: '../game',
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: true
  }
});

