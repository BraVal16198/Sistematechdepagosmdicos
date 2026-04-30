import {
  LayoutDashboard,
  UserPlus,
  Calendar,
  FileText,
  CreditCard,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  userRole: string;
}

export function Sidebar({ activeView, onViewChange, onLogout, userRole }: SidebarProps) {
  const getMenuItems = () => {
    if (userRole === 'administrador') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'registro', label: 'Registro Pacientes', icon: UserPlus },
        { id: 'citas', label: 'Gestión de Citas', icon: Calendar },
        { id: 'horarios', label: 'Horarios', icon: Calendar },
        { id: 'historial', label: 'Historial Clínico', icon: FileText },
        { id: 'pagos', label: 'Pagos y Facturación', icon: CreditCard },
      ];
    }

    if (userRole === 'admin') {
      return [
        { id: 'citas', label: 'Gestión de Citas', icon: Calendar },
        { id: 'horarios', label: 'Horarios', icon: Calendar },
        { id: 'historial', label: 'Historial Clínico', icon: FileText },
        { id: 'pagos', label: 'Caja del Día', icon: CreditCard },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl text-white">Sistema Tech</h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">Gestión Médica</p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeView === item.id
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'hover:bg-sidebar-accent text-sidebar-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
