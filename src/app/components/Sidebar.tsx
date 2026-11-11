import {
  LayoutDashboard,
  UserPlus,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  LogOut,
} from 'lucide-react';
import type { UserRole } from '../lib/roles';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  userRole: UserRole;
}

const ADMINISTRADOR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'registro', label: 'Registro de pacientes', icon: UserPlus },
  { id: 'citas', label: 'Gestión de citas', icon: Calendar },
  { id: 'horarios', label: 'Horarios', icon: Clock },
  { id: 'historial', label: 'Historial clínico', icon: FileText },
  { id: 'pagos', label: 'Pagos y facturación', icon: CreditCard },
];

const ADMINISTRATIVO_ITEMS = [
  { id: 'citas', label: 'Gestión de citas', icon: Calendar },
  { id: 'horarios', label: 'Horarios', icon: Clock },
  { id: 'historial', label: 'Historial clínico', icon: FileText },
  { id: 'pagos', label: 'Caja del día', icon: CreditCard },
];

export function Sidebar({ activeView, onViewChange, onLogout, userRole }: SidebarProps) {
  const menuItems =
    userRole === 'administrador'
      ? ADMINISTRADOR_ITEMS
      : userRole === 'administrativo'
        ? ADMINISTRATIVO_ITEMS
        : [];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col shrink-0" aria-label="Navegación principal">
      <div className="p-6 border-b border-sidebar-border">
        <p className="text-xl text-white font-medium">Sistema Tech</p>
        <p className="text-sm text-sidebar-foreground/70 mt-1">Gestión médica</p>
      </div>

      <nav className="flex-1 p-4" aria-label="Módulos">
        {menuItems.length === 0 ? (
          <p className="px-4 py-3 text-sm text-sidebar-foreground/70">
            No hay módulos disponibles para este rol.
          </p>
        ) : (
          menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onViewChange(item.id)}
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
          })
        )}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" aria-hidden="true" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
