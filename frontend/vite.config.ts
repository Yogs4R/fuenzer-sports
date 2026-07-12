import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // 'hidden' generates sourcemaps for internal error tracking but does NOT
    // expose them publicly — source code cannot be read via browser DevTools
    sourcemap: 'hidden',
  }
})
