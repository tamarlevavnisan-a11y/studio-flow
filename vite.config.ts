import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Dev proxy: routes /hf-api/* → HuggingFace API, bypassing browser CORS
      '/hf-api': {
        target: 'https://api-inference.huggingface.co',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/hf-api/, ''),
      },
    },
  },
})
