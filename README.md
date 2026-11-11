# Sistema Tech de Pagos Médicos

Demo frontend profesional de gestión clínica: pacientes, citas, historial, pagos/facturación y portales por rol (administrador, administrativo, médico, paciente).

> Proyecto de portafolio — datos en memoria, sin backend real. Ideal para revisión técnica / talent review.

## Capturas

![Landing](docs/screenshots/landing.png)

![Login](docs/screenshots/login.png)

![Dashboard](docs/screenshots/dashboard.png)

## Características

- **Landing pública** con contenido SEO (título, meta, Open Graph, Schema.org)
- **Autenticación demo** por rol con sesión en `sessionStorage`
- **Administrador**: dashboard, registro de pacientes, citas, horarios, historial, facturación
- **Administrativo**: citas, horarios, historial, caja del día
- **Médico**: agenda del día, atención de pacientes, registro de consultas
- **Paciente**: agendar citas, pagos demo, historial y comprobantes descargables
- **Descargas reales** de comprobantes (TXT) y reportes de caja (CSV)
- **Accesibilidad básica**: `lang="es"`, labels, skip link, `aria-*`, foco visible
- **Deploy ready**: `vercel.json`, `netlify.toml`, cabeceras de seguridad, `robots.txt`, `sitemap.xml`

## Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- Lucide React, Recharts, Sonner

## Requisitos

Par compatible (probado en este repo):

- **Node.js 22.x** (soportado: `>=20.19.0 <23`, ver `engines` en `package.json`)
- **pnpm 10.x** (`packageManager`: `pnpm@10.33.4`; rango `>=9 <11`)

También puedes usar npm, pero pnpm es el gestor declarado.

## Instalación y ejecución

```bash
pnpm install
pnpm dev
```

Build de producción:

```bash
pnpm build
pnpm preview
```

Typecheck:

```bash
pnpm typecheck
```

## Variables de entorno

Copia `.env.example` a `.env` si necesitas personalizar:

| Variable | Descripción | Default / notas |
| --- | --- | --- |
| `VITE_DEPLOY_TARGET` | `github-pages` \| `vercel` \| `netlify` \| `other` | Detecta `VERCEL`/`NETLIFY` o `github.io` en la URL |
| `VITE_SITE_URL` | Origen público (canonical, OG, robots, sitemap) | Obligatorio en build **vercel/netlify**; en GitHub Pages usa el default `github.io` del repo |
| `VITE_BASE_PATH` | Override del `base` de Vite | Auto: `/Sistematechdepagosmdicos/` (GH Pages) o `/` |
| `VITE_APP_NAME` | Nombre visible del producto | Sistema Tech… |
| `VITE_DEMO_MODE` | Auth demo local | `true` |

No se requieren secretos de API para correr el demo.

## Cuentas demo

| Usuario | Contraseña | Rol |
| --- | --- | --- |
| `admin` | `admin123` | Administrador |
| `recepcion` | `recepcion123` | Administrativo |
| `medico` | `medico123` | Médico |
| `paciente` | `paciente123` | Paciente |

## Estructura

```
├── public/               # robots, sitemap, favicon, OG, headers Netlify
├── src/
│   ├── app/
│   │   ├── components/   # UI de módulos y landing
│   │   ├── data/         # catálogos demo
│   │   └── lib/          # auth + descargas
│   ├── styles/
│   └── main.tsx
├── vercel.json
├── netlify.toml
└── package.json
```

## Despliegue

### GitHub Pages (proyecto)

```bash
VITE_DEPLOY_TARGET=github-pages pnpm build
```

- `base` = `/Sistematechdepagosmdicos/`
- Si no defines `VITE_SITE_URL`, se usa `https://braval16198.github.io/Sistematechdepagosmdicos`
- El build regenera `robots.txt` y `sitemap.xml` con ese origen

### Vercel / Netlify (raíz)

```bash
VITE_DEPLOY_TARGET=vercel VITE_SITE_URL=https://tu-dominio.com pnpm build
```

- `base` = `/`
- **`VITE_SITE_URL` es obligatorio** en el build (si falta, el build falla a propósito para no publicar canonical/OG apuntando a github.io)
- Misma regla para Netlify (`VITE_DEPLOY_TARGET=netlify`)

Build command: `pnpm build` — output: `dist`. HTTPS/HSTS los aporta el hosting; cabeceras en `vercel.json` / `netlify.toml` / `public/_headers`.

## Criterios tipo auditarweb.co

Cubiertos en código / config:

| Área | Estado |
| --- | --- |
| SEO técnico (title, meta, H1, schema, robots, sitemap) | Listo |
| Open Graph / Twitter Card | Listo |
| Accesibilidad básica (lang, labels, headings, skip link) | Listo |
| Cabeceras de seguridad en hosting | Listo (requiere deploy HTTPS) |
| Contenido legible en landing | Listo |
| Core Web Vitals en producción | Depende del hosting; build code-split |

Pendiente del usuario/hosting: dominio, certificado HTTPS, valores reales de `VITE_SITE_URL`, backend/pagos reales si se industrializa.

## Licencia y contacto

MIT — ver `LICENSE`.

Autor: **Brayan Vallejo** · Repo: [Sistematechdepagosmdicos](https://github.com/BraVal16198/Sistematechdepagosmdicos)
