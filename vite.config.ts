// D:\Projects\Ease Chequ\vite.config.ts
// Финальная версия: работает как SPA, без __dirname, path, process и сторонних middlewares.
// Vite обслуживает клиент из папки ./client, фронт на 5173, API проксируется на 3000.

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const base = mode === 'production' && env.VITE_BASE_PATH ? env.VITE_BASE_PATH : '/';

  return {
    // Корень фронтенда — папка client (ожидается наличие client/index.html)
    root: 'client',

    plugins: [react()],
    base,

    server: {
      port: 5173,
      // SPA fallback включён в Vite по умолчанию — дополнительных middleware не требуется
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },

    // Алиас '@' указывает на client/src (без использования path/__dirname)
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});