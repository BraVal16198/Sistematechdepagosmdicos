export type UserRole = 'paciente' | 'medico' | 'admin' | 'administrador';

export interface DemoUser {
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
  especialidad?: string;
}

/** Usuarios de demostración — solo para portafolio / revisión local. */
export const DEMO_USERS: DemoUser[] = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'administrador',
    displayName: 'Admin Sistema',
  },
  {
    username: 'recepcion',
    password: 'recepcion123',
    role: 'admin',
    displayName: 'Recepción Clínica',
  },
  {
    username: 'medico',
    password: 'medico123',
    role: 'medico',
    displayName: 'Dr. García',
    especialidad: 'Medicina General',
  },
  {
    username: 'paciente',
    password: 'paciente123',
    role: 'paciente',
    displayName: 'Juan Pérez',
  },
];

export function authenticate(username: string, password: string): DemoUser | null {
  const normalized = username.trim().toLowerCase();
  return (
    DEMO_USERS.find(
      (u) => u.username === normalized && u.password === password
    ) ?? null
  );
}

const SESSION_KEY = 'sistematech_session';

export interface SessionUser {
  username: string;
  role: UserRole;
  displayName: string;
  especialidad?: string;
}

export function saveSession(user: SessionUser) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadSession(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
