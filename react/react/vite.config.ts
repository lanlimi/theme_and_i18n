import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 配置服务端口
  server: {
    port: 8069, // 端口号
    host: true, // 热更新
  },
  build: {
    outDir: 'dist',
  },
  // 在 Vite 构建工具中配置路径别名，将 @/ 符号映射到项目的 src 目录
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
