import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  UserPlus,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  userRole: string;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  activeView,
  onViewChange,
  onLogout,
  userRole,
  open = true,
  onClose,
}: SidebarProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // En móvil cerrado: fuera del tab order; en desktop siempre accesible
  const keyboardActive = isDesktop || open;

  const getMenuItems = () => {
    if (userRole === 'administrador') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'registro', label: 'Registro Pacientes', icon: UserPlus },
        { id: 'citas', label: 'Gestión de Citas', icon: Calendar },
        { id: 'horarios', label: 'Horarios', icon: Clock },
        { id: 'historial', label: 'Historial Clínico', icon: FileText },
        { id: 'pagos', label: 'Pagos y Facturación', icon: CreditCard },
      ];
    }

    if (userRole === 'admin') {
      return [
        { id: 'citas', label: 'Gestión de Citas', icon: Calendar },
        { id: 'horarios', label: 'Horarios', icon: Clock },
        { id: 'historial', label: 'Historial Clínico', icon: FileText },
        { id: 'pagos', label: 'Caja del Día', icon: CreditCard },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  const handleNav = (id: string) => {
    onViewChange(id);
    onClose?.();
  };

  return (
    <>
      {open && onClose && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-label="Cerrar menú"
          onClick={onClose}
        />
      )}
      <aside
        className={`w-64 bg-sidebar text-sidebar-foreground flex flex-col fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Navegación principal"
        aria-hidden={!keyboardActive}
        // @ts-expect-error React 18 types may omit inert
        inert={!keyboardActive ? true : undefined}
      >
        <div className="p-6 border-b border-sidebar-border flex items-start justify-between gap-2">
          <div>
            <h1 className="text-xl text-white">Sistema Tech</h1>
            <p className="text-sm text-sidebar-foreground/70 mt-1">Gestión Médica</p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              tabIndex={keyboardActive ? 0 : -1}
              className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 p-4" aria-label="Módulos">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                tabIndex={keyboardActive ? 0 : -1}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'hover:bg-sidebar-accent text-sidebar-foreground'
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            type="button"
            onClick={onLogout}
            tabIndex={keyboardActive ? 0 : -1}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" aria-hidden="true" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
