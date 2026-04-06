import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  /** Évite « Outdated Optimize Dep » après ajout / MAJ de @lottiefiles/dotlottie-react */
  optimizeDeps: {
    include: ['@lottiefiles/dotlottie-react', '@lottiefiles/dotlottie-web'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
