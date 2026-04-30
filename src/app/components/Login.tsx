import { useState } from 'react';
import { Activity } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, role: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('paciente');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username, role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <Activity className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl text-card-foreground mb-2">Sistema Tech</h1>
            <p className="text-muted-foreground">Sistema de Pagos y Facturación Médica</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-card-foreground">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ingrese su usuario"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">Rol</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="paciente">Paciente</option>
                <option value="medico">Médico</option>
                <option value="admin">Administrativo</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Usuario demo: admin / Contraseña: admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
