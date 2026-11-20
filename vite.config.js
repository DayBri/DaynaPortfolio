import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  // Relative base so the build works on GitHub Pages / any sub-path host.
  base: '/dayna-portfolio/',
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    chunkSizeWarningLimit: 800, // three.js is ~600 kB on its own
    rollupOptions: {
      output: {
        manualChunks: { three: ['three'], vue: ['vue', 'vuetify'] },
      },
    },
  },
});
