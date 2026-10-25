import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// Repository subpath on GitHub Pages.
// Repo: SeyhaLite/c-plus-plus-programming-khmer-course
export default defineConfig({
  base: '/c-plus-plus-programming-khmer-course/',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@codemirror') || id.includes('node_modules/codemirror') || id.includes('node_modules/@lezer')) {
            return 'codemirror';
          }
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
} as Parameters<typeof defineConfig>[0]);
