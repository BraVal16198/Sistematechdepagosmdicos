# Sistema Tech — Pagos y Gestión Médica

Demo de portafolio (SPA) para clínicas: roles, citas, historial clínico, facturación y caja del día. **Todo el estado es mock en el navegador**; no hay backend, pasarela de pagos ni cumplimiento PCI/HIPAA.

**Demo en vivo:** [https://braval16198.github.io/Sistematechdepagosmdicos/](https://braval16198.github.io/Sistematechdepagosmdicos/)

Hosting activo: **GitHub Pages** (rama `gh-pages`, HTTPS). `vercel.json` queda solo como opción alternativa de hosting (cabeceras HTTP); Pages no aplica ese archivo.

## Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- Lucide React + Recharts
- GitHub Pages (base `/Sistematechdepagosmdicos/`)

## Requisitos

- Node.js 20+ (recomendado)
- npm o pnpm

## Setup local

```bash
npm install
npm run dev
```

Otros scripts:

```bash
npm run build      # build de producción → dist/ (base GitHub Pages por defecto)
VITE_BASE=/ npm run build   # build para raíz (p. ej. Vercel)
npm run preview    # sirve dist/ en local
npm run typecheck  # TypeScript sin emitir
```

## Estructura

```
├── index.html                 # SEO, OG/Twitter, JSON-LD, H1 estático para crawlers
├── public/                    # favicon, robots.txt, sitemap.xml, og-image, security.txt
├── vercel.json                # Solo si despliega en Vercel (cabeceras + SPA rewrite)
├── .github/workflows/         # Deploy a GitHub Pages (rama gh-pages)
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx            # auth mock + vistas por rol
│   │   ├── lib/               # roles demo, descarga de archivos
│   │   └── components/        # pantallas de dominio (+ ui shadcn)
│   └── styles/
└── package.json
```

## Usuarios y roles demo

El acceso valida cuentas fijas (usuario / contraseña). El rol no se elige a mano: viene de la cuenta.

| Usuario | Contraseña | Rol | Qué ve |
| --- | --- | --- | --- |
| `administrador` | `admin` | Administrador | Dashboard, pacientes, citas, horarios, historial, pagos/facturación |
| `admin` | `admin` | Administrativo | Citas, horarios, historial, **caja del día** |
| `medico` | `medico` | Médico | Portal médico (agenda + historial) |
| `paciente` | `paciente` | Paciente | Portal paciente (citas, historial, pagos demo) |

Los formularios de tarjeta muestran de forma explícita **DEMO — sin pagos reales ni PCI**. Los datos de PAN/CVV no se envían a ningún procesador.

## Alcance y limitaciones

- Sin API, base de datos ni autenticación real
- Sin cobros reales ni tokenización de tarjetas
- Datos clínicos/financieros solo en memoria (se pierden al recargar)
- Ideal para revisión de UI/UX y storytelling de producto frontend

## SEO / AuditarWeb (GitHub Pages)

- `index.html` incluye `lang=es`, title, description, canonical, OG/Twitter, JSON-LD (`WebApplication`), `<meta name="referrer" content="strict-origin-when-cross-origin">`, H1 **Pagos y Gestión Médica** y texto español estático (≥280 palabras) en `#seo-bootstrap` (antes de React), alineado con keywords del cuerpo.
- CSP vía `<meta http-equiv="Content-Security-Policy">` (GitHub Pages no aplica `vercel.json` / `_headers`). Política: `default-src 'self'` + `script-src 'self'` + `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` + `font-src` para DM Sans + `frame-ancestors 'none'`. **Nota:** `frame-ancestors` en meta lo ignoran los navegadores; sirve a auditores. Sin excepción de Google Fonts, la tipografía cae a system-ui.
- **Cabeceras HTTP reales** (`X-Frame-Options`, `Referrer-Policy`, CSP completa): requieren Cloudflare delante de Pages o hosting Vercel/Netlify (`vercel.json` ya declara esas cabeceras). En Pages la mitigación es parcial (meta).
- `public/robots.txt` y `public/sitemap.xml` viven en la raíz del *project site* (`…/Sistematechdepagosmdicos/`). AuditarWeb a veces pide `https://braval16198.github.io/robots.txt` (apex user site) → **404** hasta crear un repo `BraVal16198.github.io` (fuera de alcance). Tampoco hay dominio custom ni backlinks inventados; DA de `*.github.io` y redirects www quedan como residuales de plataforma.
- Contraseñas demo (`admin`/`medico`/`paciente`) están etiquetadas DEMO a propósito; no hay secretos de producción en el cliente.
- `public/.well-known/security.txt` para contacto de seguridad.

## Roadmap (fuera de alcance de esta demo)

- Backend (API + persistencia) y auth real
- Pasarela de pagos / PCI DSS
- Historias clínicas con control de acceso y auditoría
- Rutas profundas (React Router) y tests e2e

## Despliegue

### GitHub Pages (activo)

1. El workflow `Deploy GitHub Pages` publica `dist/` en la rama `gh-pages`.
2. En el repo: **Settings → Pages → Branch `gh-pages` / (root)** si aún no está habilitado.
3. URL: `https://braval16198.github.io/Sistematechdepagosmdicos/`

### Vercel (opcional)

Si quiere cabeceras HTTP completas (`X-Frame-Options`, etc.):

1. Importe el repositorio en Vercel.
2. **Build Command:** `VITE_BASE=/ vite build`
3. **Output Directory:** `dist`
4. `vercel.json` ya define rewrites SPA y cabeceras de seguridad.

## Licencia

Proyecto de demostración / portafolio. Atribuciones de componentes en `ATTRIBUTIONS.md`.
