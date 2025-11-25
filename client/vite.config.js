import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              // Suppress proxy errors when backend is not running
              // Demo data will be used as fallback
              if (err.code !== 'ECONNREFUSED') {
                console.error('Proxy error:', err);
              }
            });
          },
        }
      }
    },
    build: {
      outDir: "build",
    },
    plugins: [react()],
  };
});
