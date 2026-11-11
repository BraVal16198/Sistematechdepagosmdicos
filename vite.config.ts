import { defineConfig, loadEnv, type Plugin } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const GH_PAGES_SITE_URL = 'https://braval16198.github.io/Sistematechdepagosmdicos'
const GH_PAGES_BASE = '/Sistematechdepagosmdicos/'

type DeployTarget = 'github-pages' | 'vercel' | 'netlify' | 'other'

function resolveDeployTarget(env: Record<string, string>): DeployTarget {
  const explicit = (env.VITE_DEPLOY_TARGET || '').toLowerCase()
  if (explicit === 'github-pages' || explicit === 'gh-pages') return 'github-pages'
  if (explicit === 'vercel') return 'vercel'
  if (explicit === 'netlify') return 'netlify'

  if (env.VERCEL === '1' || env.VERCEL_ENV) return 'vercel'
  if (env.NETLIFY === 'true' || env.NETLIFY) return 'netlify'

  const site = (env.VITE_SITE_URL || '').toLowerCase()
  if (site.includes('github.io')) return 'github-pages'

  return 'other'
}

function resolveSiteUrl(env: Record<string, string>, target: DeployTarget, isBuild: boolean): string {
  const configured = (env.VITE_SITE_URL || '').replace(/\/$/, '')

  if (configured) return configured

  if (target === 'github-pages') return GH_PAGES_SITE_URL

  if (isBuild && (target === 'vercel' || target === 'netlify')) {
    throw new Error(
      `[vite] VITE_SITE_URL es obligatorio para despliegues ${target}. ` +
        'Define la URL pública (sin barra final) antes del build para canonical/OG/robots/sitemap.'
    )
  }

  // Dev local / preview sin target cloud
  return GH_PAGES_SITE_URL
}

function resolveBase(target: DeployTarget, env: Record<string, string>): string {
  if (env.VITE_BASE_PATH) {
    const b = env.VITE_BASE_PATH
    return b.endsWith('/') ? b : `${b}/`
  }
  return target === 'github-pages' ? GH_PAGES_BASE : '/'
}

function figmaAssetResolver(): Plugin {
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

function htmlSiteUrlPlugin(siteUrl: string): Plugin {
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

/** Emite robots.txt y sitemap.xml con el origen de despliegue (no solo HTML). */
function seoStaticFilesPlugin(siteUrl: string): Plugin {
  const origin = siteUrl.replace(/\/$/, '')
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`

  return {
    name: 'seo-static-files',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
    },
    // Por si public/ aún copia plantillas: reescribe al cerrar el build
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist')
      if (!fs.existsSync(outDir)) return
      fs.writeFileSync(path.join(outDir, 'robots.txt'), robots)
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)
    },
  }
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isBuild = command === 'build'
  const target = resolveDeployTarget(env)
  const siteUrl = resolveSiteUrl(env, target, isBuild)
  const base = resolveBase(target, env)

  if (isBuild) {
    console.log(`[vite] deploy=${target} base=${base} siteUrl=${siteUrl}`)
  }

  return {
    base,
    plugins: [
      figmaAssetResolver(),
      htmlSiteUrlPlugin(siteUrl),
      seoStaticFilesPlugin(siteUrl),
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
