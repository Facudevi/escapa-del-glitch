import { defineConfig } from 'vite';

// base './' para que el build funcione en GitHub Pages (https://usuario.github.io/escapa-del-glitch/)
export default defineConfig({
  base: './',
  server: { port: 5173, strictPort: true },
});
