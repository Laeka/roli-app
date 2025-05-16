import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import process from 'node:process';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          // Más logging para debugging
          console.log(`Configurando proxy para /api -> ${env.VITE_API_URL}`);
          // Proxy websockets
          proxy.on('error', (err) => {
            console.error('Proxy error:', err);
          });
          
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`Proxy request: ${req.method} ${req.url}`);
            console.log('Headers:', req.headers);
            if (req.method === 'POST') {
              console.log('Body:', req.body);
            }
          });
          
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(`Proxy response: ${proxyRes.statusCode} ${req.url}`);
            
            // Registrar errores 404 con más detalle
            if (proxyRes.statusCode === 404) {
              console.warn(`RUTA NO ENCONTRADA: ${req.method} ${req.url} - Verifique que esté implementada en el servidor`);
            }
            
            // Registrar errores 400/500 con más detalle
            if (proxyRes.statusCode >= 400) {
              console.error(`ERROR EN API: ${req.method} ${req.url} - Código: ${proxyRes.statusCode}`);
            }
          });
        }
      }
    }
  }
  }
});
