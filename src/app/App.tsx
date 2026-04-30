import { useState } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { RegistroPacientes } from './components/RegistroPacientes';
import { GestionCitas } from './components/GestionCitas';
import { HistorialClinico } from './components/HistorialClinico';
import { PagosFacturacion } from './components/PagosFacturacion';
import { PortalPaciente } from './components/PortalPaciente';
import { PortalMedico } from './components/PortalMedico';
import { HorarioEspecialidades } from './components/HorarioEspecialidades';
import { CajaDia } from './components/CajaDia';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: '', role: '' });
  const [activeView, setActiveView] = useState('dashboard');

  const handleLogin = (username: string, role: string) => {
    setCurrentUser({ username, role });
    setIsAuthenticated(true);

    if (role === 'paciente') {
      setActiveView('portal-paciente');
    } else if (role === 'medico') {
      setActiveView('portal-medico');
    } else if (role === 'admin') {
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

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentUser.role === 'paciente') {
    return (
      <div className="size-full bg-background overflow-y-auto">
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Portal del Paciente</p>
              <p className="text-lg text-card-foreground">{currentUser.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        <PortalPaciente nombrePaciente={currentUser.username} />
      </div>
    );
  }

  if (currentUser.role === 'medico') {
    return (
      <div className="size-full bg-background overflow-y-auto">
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Portal Médico</p>
              <p className="text-lg text-card-foreground">{currentUser.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        <PortalMedico nombreMedico={currentUser.username} especialidad="Medicina General" />
      </div>
    );
  }

  return (
    <div className="size-full flex bg-background">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
        userRole={currentUser.role}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Bienvenido,</p>
              <p className="text-lg text-card-foreground">{currentUser.username}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Rol</p>
              <p className="text-card-foreground capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>

        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'registro' && <RegistroPacientes />}
        {activeView === 'citas' && <GestionCitas />}
        {activeView === 'horarios' && <HorarioEspecialidades />}
        {activeView === 'historial' && <HistorialClinico />}
        {activeView === 'pagos' && (currentUser.role === 'admin' ? <CajaDia /> : <PagosFacturacion />)}
      </main>
    </div>
  );
}