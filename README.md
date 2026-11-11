# Sistema Tech — Pagos y Gestión Médica

Demo de portafolio (SPA) para clínicas: roles, citas, historial clínico, facturación y caja del día. **Todo el estado es mock en el navegador**; no hay backend, pasarela de pagos ni cumplimiento PCI/HIPAA.

**Demo en vivo (objetivo Vercel):** [https://sistematech-pagos-medicos.vercel.app](https://sistematech-pagos-medicos.vercel.app)

> Si esa URL aún no responde, despliegue con el botón de Vercel o los pasos de la sección [Despliegue](#despliegue).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBraVal16198%2FSistematechdepagosmdicos&project-name=sistematech-pagos-medicos&repository-name=Sistematechdepagosmdicos)

## Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- Lucide React + Recharts
- Despliegue pensado para Vercel (`vercel.json`, salida `dist`)

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
npm run build      # build de producción → dist/
npm run preview    # sirve dist/ en local
npm run typecheck  # TypeScript sin emitir
```

## Estructura

```
├── index.html              # SEO, OG/Twitter, lang=es
├── public/                 # favicon, robots.txt, sitemap.xml, og-image
├── vercel.json             # SPA rewrites + cabeceras de seguridad
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

### Vercel (recomendado)

1. Abra [vercel.com/new](https://vercel.com/new) e importe este repositorio.
2. **Project Name:** `sistematech-pagos-medicos`
3. **Framework Preset:** Vite
4. **Build Command:** `vite build` (o `npm run build`)
5. **Output Directory:** `dist`
6. Despliegue. La URL esperada es `https://sistematech-pagos-medicos.vercel.app`.

El archivo `vercel.json` ya define rewrites SPA y cabeceras (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).

CLI (si tiene token):

```bash
npx vercel --token "$VERCEL_TOKEN" --yes --prod --name sistematech-pagos-medicos
```

### GitHub Pages (alternativa)

Si Vercel no está disponible, puede publicar `dist/` con Actions o `gh-pages` tras `npm run build`. Configure la base de Vite si el sitio no vive en la raíz del dominio.

## Licencia

Proyecto de demostración / portafolio. Atribuciones de componentes en `ATTRIBUTIONS.md`.
