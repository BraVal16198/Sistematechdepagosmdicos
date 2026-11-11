import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { HORAS_DISPONIBLES, MEDICOS, PACIENTES_DEMO, precioPorEspecialidad } from '../data/demo';
import { formatDateOnly } from '../lib/dates';

interface Cita {
  id: number;
  paciente: string;
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'programada' | 'completada' | 'cancelada';
  metodoPago: string;
  montoPagado?: number;
}

export function GestionCitas() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    paciente: '',
    medico: '',
    fecha: '',
    hora: '',
    motivo: '',
    metodoPago: 'efectivo'
  });

  const [citas, setCitas] = useState<Cita[]>([
    {
      id: 1,
      paciente: 'Juan Pérez',
      medico: 'Dr. García',
      especialidad: 'Medicina General',
      fecha: '2026-05-01',
      hora: '10:00',
      motivo: 'Consulta general',
      estado: 'programada',
      metodoPago: 'Efectivo',
      montoPagado: 150
    },
    {
      id: 2,
      paciente: 'María López',
      medico: 'Dr. Rodríguez',
      especialidad: 'Cardiología',
      fecha: '2026-05-01',
      hora: '14:00',
      motivo: 'Control',
      estado: 'programada',
      metodoPago: 'Tarjeta',
      montoPagado: 200
    },
    {
      id: 3,
      paciente: 'Carlos Sánchez',
      medico: 'Dr. García',
      especialidad: 'Medicina General',
      fecha: '2026-04-29',
      hora: '16:00',
      motivo: 'Revisión',
      estado: 'completada',
      metodoPago: 'Billetera Digital',
      montoPagado: 150
    }
  ]);

  const medicos = [...MEDICOS];
  const pacientes = [...PACIENTES_DEMO];
  const horasDisponibles = [...HORAS_DISPONIBLES];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const medicoSeleccionado = medicos.find((m) => m === formData.medico);
    const especialidad = medicoSeleccionado?.split(' - ')[1] || 'General';
    const montoCita = precioPorEspecialidad(especialidad);

    const nuevaCita: Cita = {
      id: citas.length + 1,
      paciente: formData.paciente,
      medico: formData.medico,
      especialidad: especialidad,
      fecha: formData.fecha,
      hora: formData.hora,
      motivo: formData.motivo,
      estado: 'programada',
      metodoPago: formData.metodoPago,
      montoPagado: montoCita,
    };
    setCitas([...citas, nuevaCita]);
    toast.success('Cita programada');
    setFormData({
      paciente: '',
      medico: '',
      fecha: '',
      hora: '',
      motivo: '',
      metodoPago: 'efectivo',
    });
    setMostrarFormulario(false);
  };

  const actualizarEstado = (id: number, estado: Cita['estado']) => {
    setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, estado } : c)));
    toast.success(estado === 'completada' ? 'Cita marcada como completada' : 'Cita cancelada');
  };

  const programadas = citas.filter((c) => c.estado === 'programada').length;
  const completadas = citas.filter((c) => c.estado === 'completada').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-foreground mb-2">Gestión de Citas</h2>
          <p className="text-muted-foreground">Programación y seguimiento de citas médicas</p>
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Nueva Cita
        </button>
      </div>

      {mostrarFormulario && (
        <div className="bg-card rounded-lg shadow p-6 border border-border">
          <h3 className="text-lg mb-4 text-card-foreground">Nueva Cita</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-card-foreground">Paciente</label>
              <select
                value={formData.paciente}
                onChange={(e) => setFormData({ ...formData, paciente: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Seleccione un paciente</option>
                {pacientes.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">Médico</label>
              <select
                value={formData.medico}
                onChange={(e) => setFormData({ ...formData, medico: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Seleccione un médico</option>
                {medicos.map((m, i) => (
                  <option key={i} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">Fecha</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">Hora</label>
              <select
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Seleccione una hora</option>
                {horasDisponibles.map((h, i) => (
                  <option key={i} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-card-foreground">Motivo de la consulta</label>
              <textarea
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-card-foreground">Método de Pago</label>
              <select
                value={formData.metodoPago}
                onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                <option value="billetera">Billetera Digital (Yape, Plin)</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <CalendarIcon className="w-5 h-5" />
                Programar Cita
              </button>
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="px-6 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg shadow p-6 border border-border">
          <h3 className="text-lg mb-4 text-card-foreground">Calendario de Citas</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground">Fecha</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Hora</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Paciente</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Médico</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((cita) => (
                  <tr key={cita.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-card-foreground">
                      {formatDateOnly(cita.fecha)}
                    </td>
                    <td className="py-3 px-4 text-card-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {cita.hora}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-card-foreground">{cita.paciente}</td>
                    <td className="py-3 px-4 text-card-foreground">{cita.medico}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            cita.estado === 'programada'
                              ? 'bg-blue-100 text-blue-800'
                              : cita.estado === 'completada'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                        </span>
                        {cita.estado === 'programada' && (
                          <>
                            <button
                              type="button"
                              onClick={() => actualizarEstado(cita.id, 'completada')}
                              className="p-1.5 rounded bg-green-600 text-white hover:bg-green-700"
                              aria-label={`Completar cita de ${cita.paciente}`}
                              title="Completar"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => actualizarEstado(cita.id, 'cancelada')}
                              className="p-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                              aria-label={`Cancelar cita de ${cita.paciente}`}
                              title="Cancelar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h3 className="text-lg mb-4 text-card-foreground">Disponibilidad</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-card-foreground">Dr. García</span>
                <span className="text-green-600">Disponible</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-card-foreground">Dr. Rodríguez</span>
                <span className="text-green-600">Disponible</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-card-foreground">Dra. Martínez</span>
                <span className="text-yellow-600">Ocupado</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-card-foreground">Dr. Silva</span>
                <span className="text-green-600">Disponible</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h3 className="text-lg mb-4 text-card-foreground">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total de citas</span>
                <span className="text-xl text-card-foreground">{citas.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Completadas</span>
                <span className="text-xl text-green-600">{completadas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Programadas</span>
                <span className="text-xl text-blue-600">{programadas}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
