import { useId, useState } from 'react';
import { Activity, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authenticate, type SessionUser } from '../lib/auth';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (user: SessionUser) => void;
  onBack?: () => void;
}

export function Login({ onLogin, onBack }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const formId = useId();
  const errorId = `${formId}-error`;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const userValue = String(formData.get('username') ?? username).trim();
    const passValue = String(formData.get('password') ?? password);

    const user = authenticate(userValue, passValue);
    if (!user) {
      setError('Usuario o contraseña incorrectos. Usa una cuenta demo del listado.');
      setSubmitting(false);
      return;
    }

    const session: SessionUser = {
      username: user.displayName,
      role: user.role,
      displayName: user.displayName,
      especialidad: user.especialidad,
    };
    toast.success(`Bienvenido, ${user.displayName}`);
    onLogin(session);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Volver al inicio
          </button>
        )}

        <div className="bg-card rounded-lg shadow-xl p-8 border border-border">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4"
              aria-hidden="true"
            >
              <Activity className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl text-card-foreground mb-2">Sistema Tech</h1>
            <p className="text-muted-foreground">Sistema de Pagos y Facturación Médica</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-describedby={error ? errorId : undefined}>
            <div>
              <label htmlFor={`${formId}-user`} className="block text-sm mb-2 text-card-foreground">
                Usuario
              </label>
              <input
                id={`${formId}-user`}
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ingrese su usuario"
                required
              />
            </div>

            <div>
              <label htmlFor={`${formId}-pass`} className="block text-sm mb-2 text-card-foreground">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id={`${formId}-pass`}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-11 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ingrese su contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground rounded"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p id={errorId} role="alert" className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? 'Validando…' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-muted/60 p-4 text-sm text-muted-foreground">
            <p className="text-card-foreground mb-2">Cuentas demo</p>
            <ul className="space-y-1">
              <li>
                <code className="text-xs">admin / admin123</code> — Administrador
              </li>
              <li>
                <code className="text-xs">recepcion / recepcion123</code> — Administrativo
              </li>
              <li>
                <code className="text-xs">medico / medico123</code> — Médico
              </li>
              <li>
                <code className="text-xs">paciente / paciente123</code> — Paciente
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
