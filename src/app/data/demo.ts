export const MEDICOS = [
  'Dr. García - Medicina General',
  'Dr. Rodríguez - Cardiología',
  'Dra. Martínez - Pediatría',
  'Dr. Silva - Traumatología',
] as const;

export const PACIENTES_DEMO = [
  'Juan Pérez',
  'María López',
  'Carlos Sánchez',
  'Ana Torres',
] as const;

export const HORAS_DISPONIBLES = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
] as const;

export const SERVICIOS = [
  'Consulta General',
  'Consulta Especializada',
  'Examen de Laboratorio',
  'Control Prenatal',
  'Procedimiento Menor',
] as const;

export function precioPorEspecialidad(especialidad: string): number {
  return especialidad === 'Medicina General' ? 150 : 200;
}
