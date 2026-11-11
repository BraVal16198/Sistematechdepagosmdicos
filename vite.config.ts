import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// Base for GitHub project Pages; override with VITE_BASE=/ for Vercel root deploys.
const base = process.env.VITE_BASE || '/Sistematechdepagosmdicos/'

export default defineConfig({
  base,
  plugins: [figmaAssetResolver(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  preview: {
    allowedHosts: true,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
  },
})
