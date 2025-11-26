import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Refrigee/',
  define: {
    // 提供默认的环境变量,避免构建时报错
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
})
