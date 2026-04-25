import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Desktop builds are loaded from file://, so asset paths must be relative.
  base: mode === 'app-desktop' ? './' : '/',
}))
