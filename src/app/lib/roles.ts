export type UserRole =
  | 'paciente'
  | 'medico'
  | 'administrativo'
  | 'administrador';

export const ROLE_LABELS: Record<UserRole, string> = {
  paciente: 'Paciente',
  medico: 'Médico',
  administrativo: 'Administrativo',
  administrador: 'Administrador',
};

/** Cuentas demo para el portafolio (auth mock en cliente). */
export const DEMO_ACCOUNTS: Array<{
  username: string;
  password: string;
  role: UserRole;
  label: string;
}> = [
  {
    username: 'administrador',
    password: 'admin',
    role: 'administrador',
    label: 'Administrador (acceso completo)',
  },
  {
    username: 'admin',
    password: 'admin',
    role: 'administrativo',
    label: 'Administrativo (citas y caja)',
  },
  {
    username: 'medico',
    password: 'medico',
    role: 'medico',
    label: 'Médico (portal clínico)',
  },
  {
    username: 'paciente',
    password: 'paciente',
    role: 'paciente',
    label: 'Paciente (portal y pagos demo)',
  },
];

export function findDemoAccount(username: string, password: string) {
  return DEMO_ACCOUNTS.find(
    (account) =>
      account.username.toLowerCase() === username.trim().toLowerCase() &&
      account.password === password
  );
}

export function isStaffRole(role: string): role is 'administrativo' | 'administrador' {
  return role === 'administrativo' || role === 'administrador';
}
