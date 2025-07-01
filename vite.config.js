import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',           // 🔥 외부 접속 허용
    port: 5173,                // 원하는 포트
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 API 주소
        changeOrigin: true,
        rewrite: path => path,
      },
    },
    historyApiFallback: true, // SPA 라우터 대응
  },
})
