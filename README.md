# Sistema Tech — Pagos y Gestión Médica

Demo de portafolio (SPA) para clínicas: roles, citas, historial clínico, facturación y caja del día. **Todo el estado es mock en el navegador**; no hay backend, pasarela de pagos ni cumplimiento PCI/HIPAA.

**Demo en vivo:** [https://braval16198.github.io/Sistematechdepagosmdicos/](https://braval16198.github.io/Sistematechdepagosmdicos/)

> Despliegue actual: **GitHub Pages**. Alternativa Vercel: project name `sistematech-pagos-medicos`, build `vite build` con `VITE_BASE=/`, output `dist`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBraVal16198%2FSistematechdepagosmdicos&project-name=sistematech-pagos-medicos&repository-name=Sistematechdepagosmdicos)

## Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- Lucide React + Recharts
- GitHub Pages (base `/Sistematechdepagosmdicos/`) + `vercel.json` opcional

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
VITE_BASE=/ npm run build   # build para raíz (Vercel)
npm run preview    # sirve dist/ en local
npm run typecheck  # TypeScript sin emitir
```

## Estructura

```
├── index.html              # SEO, OG/Twitter, lang=es
├── public/                 # favicon, robots.txt, sitemap.xml, og-image
├── vercel.json             # SPA rewrites + cabeceras de seguridad (Vercel)
├── .github/workflows/      # Deploy a GitHub Pages (rama gh-pages)
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx         # auth mock + vistas por rol
│   │   ├── lib/            # roles demo, descarga de archivos
│   │   └── components/     # pantallas de dominio (+ ui shadcn)
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

1. Importe el repositorio en Vercel.
2. **Project Name:** `sistematech-pagos-medicos`
3. **Build Command:** `VITE_BASE=/ vite build` (o `VITE_BASE=/ npm run build`)
4. **Output Directory:** `dist`
5. URL esperada: `https://sistematech-pagos-medicos.vercel.app`

CLI (si tiene token):

```bash
VITE_BASE=/ npx vercel --token "$VERCEL_TOKEN" --yes --prod --name sistematech-pagos-medicos
```

## Licencia

Proyecto de demostración / portafolio. Atribuciones de componentes en `ATTRIBUTIONS.md`.
