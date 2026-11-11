import { lazy, Suspense, useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Toaster } from 'sonner';
import { Login } from './components/Login';
import { Landing } from './components/Landing';
import { Sidebar } from './components/Sidebar';
import {
  clearSession,
  loadSession,
  saveSession,
  type SessionUser,
} from './lib/auth';

const Dashboard = lazy(() =>
  import('./components/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const RegistroPacientes = lazy(() =>
  import('./components/RegistroPacientes').then((m) => ({ default: m.RegistroPacientes }))
);
const GestionCitas = lazy(() =>
  import('./components/GestionCitas').then((m) => ({ default: m.GestionCitas }))
);
const HistorialClinico = lazy(() =>
  import('./components/HistorialClinico').then((m) => ({ default: m.HistorialClinico }))
);
const PagosFacturacion = lazy(() =>
  import('./components/PagosFacturacion').then((m) => ({ default: m.PagosFacturacion }))
);
const PortalPaciente = lazy(() =>
  import('./components/PortalPaciente').then((m) => ({ default: m.PortalPaciente }))
);
const PortalMedico = lazy(() =>
  import('./components/PortalMedico').then((m) => ({ default: m.PortalMedico }))
);
const HorarioEspecialidades = lazy(() =>
  import('./components/HorarioEspecialidades').then((m) => ({
    default: m.HorarioEspecialidades,
  }))
);
const CajaDia = lazy(() =>
  import('./components/CajaDia').then((m) => ({ default: m.CajaDia }))
);

function ViewFallback() {
  return (
    <div className="p-6 text-muted-foreground" role="status" aria-live="polite">
      Cargando módulo…
    </div>
  );
}

type Screen = 'landing' | 'login' | 'app';

function defaultViewForRole(role: string): string {
  if (role === 'paciente') return 'portal-paciente';
  if (role === 'medico') return 'portal-medico';
  if (role === 'admin') return 'citas';
  return 'dashboard';
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const session = loadSession();
    if (session) {
      setCurrentUser(session);
      setActiveView(defaultViewForRole(session.role));
      setScreen('app');
    }
  }, []);

  const handleLogin = (user: SessionUser) => {
    saveSession(user);
    setCurrentUser(user);
    setActiveView(defaultViewForRole(user.role));
    setScreen('app');
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setActiveView('dashboard');
    setSidebarOpen(false);
    setScreen('landing');
  };

  return (
    <>
      <Toaster richColors position="top-right" closeButton />

      {screen === 'landing' && (
        <Landing onGoToLogin={() => setScreen('login')} />
      )}

      {screen === 'login' && (
        <Login onLogin={handleLogin} onBack={() => setScreen('landing')} />
      )}

      {screen === 'app' && currentUser?.role === 'paciente' && (
        <div className="size-full bg-background overflow-y-auto">
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portal del Paciente</p>
                <p className="text-lg text-card-foreground">{currentUser.displayName}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </header>
          <Suspense fallback={<ViewFallback />}>
            <PortalPaciente nombrePaciente={currentUser.displayName} />
          </Suspense>
        </div>
      )}

      {screen === 'app' && currentUser?.role === 'medico' && (
        <div className="size-full bg-background overflow-y-auto">
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portal Médico</p>
                <p className="text-lg text-card-foreground">{currentUser.displayName}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </header>
          <Suspense fallback={<ViewFallback />}>
            <PortalMedico
              nombreMedico={currentUser.displayName}
              especialidad={currentUser.especialidad ?? 'Medicina General'}
            />
          </Suspense>
        </div>
      )}

      {screen === 'app' &&
        currentUser &&
        (currentUser.role === 'admin' || currentUser.role === 'administrador') && (
          <div className="size-full flex bg-background">
            <Sidebar
              activeView={activeView}
              onViewChange={setActiveView}
              onLogout={handleLogout}
              userRole={currentUser.role}
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <div className="flex-1 overflow-y-auto min-w-0">
              <header className="bg-card border-b border-border px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      className="lg:hidden p-2 rounded-lg border border-border hover:bg-muted"
                      onClick={() => setSidebarOpen(true)}
                      aria-label="Abrir menú"
                    >
                      <Menu className="w-5 h-5" />
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">Bienvenido,</p>
                      <p className="text-lg text-card-foreground truncate">
                        {currentUser.displayName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-muted-foreground">Rol</p>
                    <p className="text-card-foreground capitalize">
                      {currentUser.role === 'admin' ? 'Administrativo' : 'Administrador'}
                    </p>
                  </div>
                </div>
              </header>

              <main>
                <Suspense fallback={<ViewFallback />}>
                  {activeView === 'dashboard' && <Dashboard />}
                  {activeView === 'registro' && <RegistroPacientes />}
                  {activeView === 'citas' && <GestionCitas />}
                  {activeView === 'horarios' && <HorarioEspecialidades />}
                  {activeView === 'historial' && <HistorialClinico />}
                  {activeView === 'pagos' &&
                    (currentUser.role === 'admin' ? <CajaDia /> : <PagosFacturacion />)}
                </Suspense>
              </main>
            </div>
          </div>
        )}
    </>
  );
}
