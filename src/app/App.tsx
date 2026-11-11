import { Suspense, lazy, useState } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { ROLE_LABELS, type UserRole } from './lib/roles';

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
    <div className="p-6 text-muted-foreground text-sm" role="status">
      Cargando vista…
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; role: UserRole | '' }>({
    username: '',
    role: '',
  });
  const [activeView, setActiveView] = useState('dashboard');

  const handleLogin = (username: string, role: UserRole) => {
    setCurrentUser({ username, role });
    setIsAuthenticated(true);

    if (role === 'paciente') {
      setActiveView('portal-paciente');
    } else if (role === 'medico') {
      setActiveView('portal-medico');
    } else if (role === 'administrativo') {
      setActiveView('citas');
    } else {
      setActiveView('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser({ username: '', role: '' });
    setActiveView('dashboard');
  };

  if (!isAuthenticated || !currentUser.role) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentUser.role === 'paciente') {
    return (
      <div className="size-full bg-background overflow-y-auto">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Portal del paciente</p>
              <h1 className="text-lg text-card-foreground">{currentUser.username}</h1>
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
          <PortalPaciente nombrePaciente={currentUser.username} />
        </Suspense>
      </div>
    );
  }

  if (currentUser.role === 'medico') {
    return (
      <div className="size-full bg-background overflow-y-auto">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Portal médico</p>
              <h1 className="text-lg text-card-foreground">{currentUser.username}</h1>
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
          <PortalMedico nombreMedico={currentUser.username} especialidad="Medicina General" />
        </Suspense>
      </div>
    );
  }

  const roleLabel = ROLE_LABELS[currentUser.role];

  return (
    <div className="size-full flex bg-background">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
        userRole={currentUser.role}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Bienvenido/a</p>
              <h1 className="text-lg text-card-foreground">{currentUser.username}</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Rol</p>
              <p className="text-card-foreground">{roleLabel}</p>
            </div>
          </div>
        </header>

        <main id="contenido-principal" className="flex-1 overflow-y-auto">
          <Suspense fallback={<ViewFallback />}>
            {activeView === 'dashboard' && currentUser.role === 'administrador' && <Dashboard />}
            {activeView === 'registro' && currentUser.role === 'administrador' && (
              <RegistroPacientes />
            )}
            {activeView === 'citas' && <GestionCitas />}
            {activeView === 'horarios' && <HorarioEspecialidades />}
            {activeView === 'historial' && <HistorialClinico />}
            {activeView === 'pagos' &&
              (currentUser.role === 'administrativo' ? <CajaDia /> : <PagosFacturacion />)}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
