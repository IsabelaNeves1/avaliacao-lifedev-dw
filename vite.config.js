import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Substitui o módulo 'crypto' por 'crypto-browserify'
      crypto: 'crypto-browserify',
    },
  },
})
