import { Activity, Calendar, CreditCard, FileText, Shield, Users, ArrowRight } from 'lucide-react';

interface LandingProps {
  onGoToLogin: () => void;
}

const features = [
  {
    icon: Users,
    title: 'Registro de pacientes',
    description: 'Ficha clínica básica, búsqueda y datos de contacto en un solo lugar.',
  },
  {
    icon: Calendar,
    title: 'Citas y horarios',
    description: 'Agenda por especialidad, disponibilidad en tiempo real y confirmación de turno.',
  },
  {
    icon: FileText,
    title: 'Historial clínico',
    description: 'Consultas, diagnósticos y tratamientos accesibles para el equipo médico.',
  },
  {
    icon: CreditCard,
    title: 'Pagos y facturación',
    description: 'Cobros, comprobantes, caja del día y métodos de pago habituales en Perú.',
  },
];

export function Landing({ onGoToLogin }: LandingProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Saltar al contenido
      </a>

      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center" aria-hidden="true">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-lg leading-tight text-foreground">Sistema Tech</p>
              <p className="text-xs text-muted-foreground">Pagos médicos</p>
            </div>
          </div>
          <nav aria-label="Principal" className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#funciones" className="text-muted-foreground hover:text-foreground transition-colors">
              Funciones
            </a>
            <a href="#seguridad" className="text-muted-foreground hover:text-foreground transition-colors">
              Seguridad
            </a>
            <button
              type="button"
              onClick={onGoToLogin}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Acceder
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </nav>
          <button
            type="button"
            onClick={onGoToLogin}
            className="sm:hidden inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm"
          >
            Acceder
          </button>
        </div>
      </header>

      <main id="contenido">
        <section
          className="relative overflow-hidden border-b border-border"
          aria-labelledby="hero-title"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary"
            aria-hidden="true"
          />
          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm uppercase tracking-wide text-primary mb-3">Clínicas y consultorios</p>
              <h1 id="hero-title" className="text-4xl md:text-5xl text-foreground mb-4 leading-tight">
                Sistema Tech de Pagos Médicos
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Plataforma demo para gestionar pacientes, citas, historial clínico y cobros en un flujo
                unificado para administración, médicos y pacientes.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onGoToLogin}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Entrar al demo
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <a
                  href="#funciones"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-card-foreground hover:bg-muted transition-colors"
                >
                  Ver funciones
                </a>
              </div>
            </div>
            <div className="relative min-h-[240px] md:min-h-[320px] rounded-2xl bg-sidebar text-sidebar-foreground p-6 shadow-lg overflow-hidden">
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-sidebar-primary/30" aria-hidden="true" />
              <p className="text-sm text-sidebar-foreground/70 mb-2">Vista rápida</p>
              <p className="text-2xl mb-6">Operación clínica del día</p>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between gap-4 border-b border-sidebar-border pb-2">
                  <span>Citas programadas</span>
                  <span>8</span>
                </li>
                <li className="flex justify-between gap-4 border-b border-sidebar-border pb-2">
                  <span>Cobros del día</span>
                  <span>S/ 680.00</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Facturas pendientes</span>
                  <span>3</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="funciones" className="max-w-6xl mx-auto px-4 py-16" aria-labelledby="funciones-title">
          <h2 id="funciones-title" className="text-3xl text-foreground mb-3">
            Qué incluye el sistema
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Módulos listos para demostración de portafolio: roles diferenciados, flujos de pago y
            descarga de comprobantes e historiales.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="p-6 border border-border rounded-xl bg-card"
                >
                  <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg text-card-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="seguridad"
          className="bg-secondary/40 border-y border-border"
          aria-labelledby="seguridad-title"
        >
          <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h2 id="seguridad-title" className="text-3xl text-foreground mb-3 flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" aria-hidden="true" />
                Preparado para auditoría web
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                SEO técnico (meta, Open Graph, schema, robots/sitemap), accesibilidad básica (idioma,
                encabezados, etiquetas, foco), cabeceras de seguridad en deploy y build listo para
                Vercel o Netlify.
              </p>
            </div>
            <button
              type="button"
              onClick={onGoToLogin}
              className="justify-self-start md:justify-self-end inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Probar ahora
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row gap-4 justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Sistema Tech — Brayan Vallejo</p>
          <p>Demo frontend sin backend. Datos de ejemplo únicamente.</p>
        </div>
      </footer>
    </div>
  );
}
