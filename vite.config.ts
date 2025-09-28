import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Single-page setup: agent page served at "/"
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  // No multi-page inputs: build uses index.html as the sole entry
});