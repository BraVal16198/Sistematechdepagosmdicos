import { defineConfig, loadEnv, type Plugin } from 'vite'
import path from 'path'
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

  // Proveedores cloud: comparación estricta (evita falsos positivos locales)
  if (env.VERCEL === '1') return 'vercel'
  if (env.NETLIFY === 'true') return 'netlify'

  // `other` explícito antes de inferir GH Pages por github.io en la URL
  if (explicit === 'other') return 'other'

  const site = (env.VITE_SITE_URL || '').toLowerCase()
  if (site.includes('github.io')) return 'github-pages'

  return 'other'
}

function resolveBase(target: DeployTarget, env: Record<string, string>): string {
  if (env.VITE_BASE_PATH) {
    const b = env.VITE_BASE_PATH
    return b.endsWith('/') ? b : `${b}/`
  }
  return target === 'github-pages' ? GH_PAGES_BASE : '/'
}

/** Une origen + base de assets sin duplicar el path del proyecto. */
function joinSiteUrlWithBase(siteUrl: string, base: string): string {
  const cleaned = siteUrl.replace(/\/$/, '')
  const basePath = base === '/' ? '' : base.replace(/\/$/, '')
  if (!basePath) return cleaned
  try {
    const u = new URL(cleaned)
    const path = (u.pathname || '/').replace(/\/$/, '') || ''
    if (path === basePath || path.startsWith(`${basePath}/`)) return cleaned
    if (path === '' || path === '/') return `${u.origin}${basePath}`
    return cleaned
  } catch {
    return cleaned
  }
}

function resolveSiteUrl(
  env: Record<string, string>,
  target: DeployTarget,
  base: string,
  isBuild: boolean
): string {
  const configured = (env.VITE_SITE_URL || '').replace(/\/$/, '')

  if (configured) return joinSiteUrlWithBase(configured, base)

  if (target === 'github-pages') return GH_PAGES_SITE_URL

  if (isBuild && (target === 'vercel' || target === 'netlify')) {
    throw new Error(
      `[vite] VITE_SITE_URL es obligatorio para despliegues ${target}. ` +
        'Define la URL pública (sin barra final) antes del build para canonical/OG/robots/sitemap.'
    )
  }

  // Dev local / preview sin target cloud
  return joinSiteUrlWithBase(GH_PAGES_SITE_URL, base)
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
  const absolute = siteUrl.replace(/\/$/, '')
  return {
    name: 'html-site-url',
    transformIndexHtml: {
      order: 'pre',
      handler(html: string) {
        // Placeholder propio (no %VITE_*) para que Vite no lo reemplace con el env crudo
        return html
          .replaceAll('%APP_PUBLIC_URL%', absolute)
          .replaceAll('%VITE_SITE_URL%', absolute)
          .replaceAll('%VITE_SITE_ORIGIN%', absolute)
      },
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
  }
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isBuild = command === 'build'
  const target = resolveDeployTarget(env)
  const base = resolveBase(target, env)
  const siteUrl = resolveSiteUrl(env, target, base, isBuild)

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
