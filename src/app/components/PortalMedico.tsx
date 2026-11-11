import { useState } from 'react';
import { Calendar, FileText, Clock, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';

interface CitaMedico {
  id: number;
  paciente: string;
  hora: string;
  motivo: string;
  estado: 'pendiente' | 'en-atencion' | 'atendida';
}

interface HistorialPaciente {
  id: number;
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
}

export function PortalMedico({
  nombreMedico,
  especialidad,
}: {
  nombreMedico: string;
  especialidad: string;
}) {
  const [vistaActiva, setVistaActiva] = useState('agenda');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formHistorial, setFormHistorial] = useState({
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
  });

  const [citasHoy, setCitasHoy] = useState<CitaMedico[]>([
    {
      id: 1,
      paciente: 'Juan Pérez',
      hora: '10:00',
      motivo: 'Consulta general',
      estado: 'pendiente',
    },
    {
      id: 2,
      paciente: 'María López',
      hora: '15:00',
      motivo: 'Control',
      estado: 'pendiente',
    },
  ]);

  const pacientes = ['Juan Pérez', 'María López', 'Carlos Sánchez'];

  const [historiales, setHistoriales] = useState<Record<string, HistorialPaciente[]>>({
    'Juan Pérez': [
      {
        id: 1,
        fecha: '2026-04-15',
        diagnostico: 'Hipertensión arterial',
        tratamiento: 'Enalapril 10mg',
        observaciones: 'Control en 30 días',
      },
    ],
    'María López': [
      {
        id: 1,
        fecha: '2026-04-20',
        diagnostico: 'Control prenatal',
        tratamiento: 'Ácido fólico',
        observaciones: 'Embarazo normal',
      },
    ],
  });

  const atenderPaciente = (cita: CitaMedico) => {
    setCitasHoy((prev) =>
      prev.map((c) =>
        c.id === cita.id
          ? { ...c, estado: 'en-atencion' }
          : c.estado === 'en-atencion'
            ? { ...c, estado: 'pendiente' }
            : c
      )
    );
    setPacienteSeleccionado(cita.paciente);
    setVistaActiva('historial');
    setMostrarFormulario(true);
    toast.message(`Atendiendo a ${cita.paciente}`);
  };

  const handleSubmitHistorial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteSeleccionado) return;

    const nueva: HistorialPaciente = {
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      ...formHistorial,
    };

    setHistoriales((prev) => ({
      ...prev,
      [pacienteSeleccionado]: [nueva, ...(prev[pacienteSeleccionado] ?? [])],
    }));

    setCitasHoy((prev) =>
      prev.map((c) =>
        c.paciente === pacienteSeleccionado && c.estado === 'en-atencion'
          ? { ...c, estado: 'atendida' }
          : c
      )
    );

    toast.success('Historial clínico guardado');
    setFormHistorial({ diagnostico: '', tratamiento: '', observaciones: '' });
    setMostrarFormulario(false);
  };

  const estadoLabel = (estado: CitaMedico['estado']) => {
    if (estado === 'atendida') return 'Atendida';
    if (estado === 'en-atencion') return 'En atención';
    return 'Pendiente';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-foreground mb-2">Portal Médico</h2>
        <p className="text-muted-foreground">
          {nombreMedico} — {especialidad}
        </p>
      </div>

      <div className="flex gap-4 border-b border-border" role="tablist" aria-label="Secciones del portal">
        <button
          type="button"
          role="tab"
          aria-selected={vistaActiva === 'agenda'}
          onClick={() => setVistaActiva('agenda')}
          className={`px-4 py-2 ${
            vistaActiva === 'agenda'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Mi agenda
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={vistaActiva === 'historial'}
          onClick={() => setVistaActiva('historial')}
          className={`px-4 py-2 ${
            vistaActiva === 'historial'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Gestión de historiales
        </button>
      </div>

      {vistaActiva === 'agenda' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg text-blue-900 mb-2">Mi horario de hoy</h3>
            <p className="text-sm text-blue-700">
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {citasHoy.map((cita) => (
              <article key={cita.id} className="bg-card border border-border rounded-lg p-6 shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg text-card-foreground">{cita.paciente}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      {cita.hora}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      cita.estado === 'atendida'
                        ? 'bg-green-100 text-green-800'
                        : cita.estado === 'en-atencion'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {estadoLabel(cita.estado)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Motivo: {cita.motivo}</p>
                {cita.estado !== 'atendida' && (
                  <button
                    type="button"
                    onClick={() => atenderPaciente(cita)}
                    className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {cita.estado === 'en-atencion' ? 'Continuar atención' : 'Atender paciente'}
                  </button>
                )}
              </article>
            ))}
          </div>

          {citasHoy.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" aria-hidden="true" />
              <p>No tienes citas programadas para hoy</p>
            </div>
          )}
        </div>
      )}

      {vistaActiva === 'historial' && (
        <div className="space-y-6">
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <div className="mb-4">
              <label htmlFor="medico-paciente" className="block text-sm mb-2 text-card-foreground">
                Seleccionar paciente
              </label>
              <select
                id="medico-paciente"
                value={pacienteSeleccionado}
                onChange={(e) => setPacienteSeleccionado(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Seleccione un paciente...</option>
                {pacientes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {pacienteSeleccionado && (
              <>
                <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
                  <h3 className="text-lg text-card-foreground">
                    Historial de {pacienteSeleccionado}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-5 h-5" aria-hidden="true" />
                    Nueva consulta
                  </button>
                </div>

                {mostrarFormulario && (
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <form onSubmit={handleSubmitHistorial} className="space-y-4">
                      <div>
                        <label htmlFor="pm-dx" className="block text-sm mb-2 text-card-foreground">
                          Diagnóstico
                        </label>
                        <textarea
                          id="pm-dx"
                          value={formHistorial.diagnostico}
                          onChange={(e) =>
                            setFormHistorial({ ...formHistorial, diagnostico: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          rows={2}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="pm-tx" className="block text-sm mb-2 text-card-foreground">
                          Tratamiento
                        </label>
                        <textarea
                          id="pm-tx"
                          value={formHistorial.tratamiento}
                          onChange={(e) =>
                            setFormHistorial({ ...formHistorial, tratamiento: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          rows={2}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="pm-obs" className="block text-sm mb-2 text-card-foreground">
                          Observaciones
                        </label>
                        <textarea
                          id="pm-obs"
                          value={formHistorial.observaciones}
                          onChange={(e) =>
                            setFormHistorial({ ...formHistorial, observaciones: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Save className="w-5 h-5" aria-hidden="true" />
                          Guardar consulta
                        </button>
                        <button
                          type="button"
                          onClick={() => setMostrarFormulario(false)}
                          className="px-6 py-2 bg-card text-muted-foreground border border-border rounded-lg hover:bg-muted/80 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  {(historiales[pacienteSeleccionado] ?? []).map((consulta) => (
                    <article key={consulta.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(consulta.fecha).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Diagnóstico:</span>
                          <p className="text-card-foreground">{consulta.diagnostico}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Tratamiento:</span>
                          <p className="text-card-foreground">{consulta.tratamiento}</p>
                        </div>
                        {consulta.observaciones && (
                          <div>
                            <span className="text-sm text-muted-foreground">Observaciones:</span>
                            <p className="text-card-foreground">{consulta.observaciones}</p>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            {!pacienteSeleccionado && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" aria-hidden="true" />
                <p>Seleccione un paciente para ver su historial</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
