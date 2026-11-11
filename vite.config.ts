import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const DEFAULT_SITE_URL = 'https://braval16198.github.io/Sistematechdepagosmdicos'

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

function htmlSiteUrlPlugin(siteUrl: string) {
  const base = siteUrl.replace(/\/$/, '')
  return {
    name: 'html-site-url',
    transformIndexHtml(html: string) {
      return html
        .replaceAll('%VITE_SITE_URL%', base)
        .replaceAll('%VITE_SITE_ORIGIN%', base)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')

  return {
    plugins: [
      figmaAssetResolver(),
      htmlSiteUrlPlugin(siteUrl),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    assetsInclude: ['**/*.svg', '**/*.csv'],
    build: {
      target: 'es2022',
      sourcemap: false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 700,
    },
  }
})
