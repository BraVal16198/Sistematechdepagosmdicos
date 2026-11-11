import { useState } from 'react';
import { Activity } from 'lucide-react';
import { DEMO_ACCOUNTS, findDemoAccount, type UserRole } from '../lib/roles';

interface LoginProps {
  onLogin: (username: string, role: UserRole) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const account = findDemoAccount(username, password);
    if (!account) {
      setError(
        'Credenciales no válidas. Use una cuenta demo de la lista inferior (usuario y contraseña).'
      );
      return;
    }

    onLogin(account.username, account.role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Saltar al formulario de acceso
      </a>

      <main className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-xl p-8 border border-border">
          <header className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4"
              aria-hidden="true"
            >
              <Activity className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="text-sm font-medium text-primary mb-1">Sistema Tech</p>
            <h1 className="text-2xl text-card-foreground mb-2">
              Pagos y Gestión Médica
            </h1>
            <p className="text-muted-foreground text-sm" id="aviso-demo">
              Demo de portafolio con datos simulados. No procesa cobros reales.
            </p>
          </header>

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="username" className="block text-sm mb-2 text-card-foreground">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ej.: administrador"
                required
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'login-error' : 'login-help'}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-card-foreground">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Contraseña demo"
                required
                aria-invalid={Boolean(error)}
              />
            </div>

            {error ? (
              <p
                id="login-error"
                role="alert"
                className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
              >
                {error}
              </p>
            ) : (
              <p id="login-help" className="text-xs text-muted-foreground">
                El rol se asigna automáticamente según la cuenta demo.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Iniciar sesión
            </button>
          </form>

          <section
            id="demo-cuentas"
            className="mt-6 rounded-lg bg-muted/60 p-4"
            aria-labelledby="demo-accounts-title"
          >
            <h2 id="demo-accounts-title" className="text-sm font-medium text-card-foreground mb-2">
              Cuentas DEMO (no son secretos)
            </h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {DEMO_ACCOUNTS.map((account) => (
                <li key={account.username}>
                  <span className="text-card-foreground font-medium">{account.username}</span>
                  {' / '}
                  <span aria-label={`Contraseña DEMO ${account.password}`}>
                    {account.password}
                  </span>
                  <span className="block text-xs">
                    DEMO — {account.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
