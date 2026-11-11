import { useState } from 'react';
import { Calendar, FileText, Clock, Plus, Save } from 'lucide-react';

interface CitaMedico {
  id: number;
  paciente: string;
  hora: string;
  motivo: string;
  estado: string;
}

interface HistorialPaciente {
  id: number;
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
}

export function PortalMedico({ nombreMedico, especialidad }: { nombreMedico: string; especialidad: string }) {
  const [vistaActiva, setVistaActiva] = useState('agenda');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formHistorial, setFormHistorial] = useState({
    diagnostico: '',
    tratamiento: '',
    observaciones: ''
  });

  const citasHoy: CitaMedico[] = [
    {
      id: 1,
      paciente: 'Juan Pérez',
      hora: '10:00',
      motivo: 'Consulta general',
      estado: 'pendiente'
    },
    {
      id: 2,
      paciente: 'María López',
      hora: '15:00',
      motivo: 'Control',
      estado: 'pendiente'
    }
  ];

  const pacientes = ['Juan Pérez', 'María López', 'Carlos Sánchez'];

  const [historiales, setHistoriales] = useState<Record<string, HistorialPaciente[]>>({
    'Juan Pérez': [
      {
        id: 1,
        fecha: '2026-04-15',
        diagnostico: 'Hipertensión arterial',
        tratamiento: 'Enalapril 10mg',
        observaciones: 'Control en 30 días'
      }
    ],
    'María López': [
      {
        id: 1,
        fecha: '2026-04-20',
        diagnostico: 'Control prenatal',
        tratamiento: 'Ácido fólico',
        observaciones: 'Embarazo normal'
      }
    ]
  });
  const [mensaje, setMensaje] = useState('');
  const [citas, setCitas] = useState(citasHoy);

  const handleSubmitHistorial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteSeleccionado) return;
    const actuales = historiales[pacienteSeleccionado] || [];
    const nueva: HistorialPaciente = {
      id: actuales.length + 1,
      fecha: new Date().toISOString().split('T')[0],
      diagnostico: formHistorial.diagnostico,
      tratamiento: formHistorial.tratamiento,
      observaciones: formHistorial.observaciones,
    };
    setHistoriales({
      ...historiales,
      [pacienteSeleccionado]: [nueva, ...actuales],
    });
    setMensaje('Consulta añadida al historial demo (solo en memoria).');
    setFormHistorial({
      diagnostico: '',
      tratamiento: '',
      observaciones: ''
    });
    setMostrarFormulario(false);
  };

  const atenderCita = (id: number) => {
    setCitas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: 'en-atencion' } : c))
    );
    const cita = citas.find((c) => c.id === id);
    if (cita) {
      setPacienteSeleccionado(cita.paciente);
      setVistaActiva('historial');
      setMostrarFormulario(true);
      setMensaje(`Atención iniciada para ${cita.paciente}.`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-foreground mb-2">Portal médico</h2>
        <p className="text-muted-foreground">
          {nombreMedico} — {especialidad} (datos mock)
        </p>
        {mensaje && (
          <p role="status" className="mt-2 text-sm text-teal-800 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
            {mensaje}
          </p>
        )}
      </div>

      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setVistaActiva('agenda')}
          className={`px-4 py-2 ${
            vistaActiva === 'agenda'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Mi Agenda
        </button>
        <button
          onClick={() => setVistaActiva('historial')}
          className={`px-4 py-2 ${
            vistaActiva === 'historial'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Gestión de Historiales
        </button>
      </div>

      {vistaActiva === 'agenda' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg text-blue-900 mb-2">Mi Horario de Hoy</h3>
            <p className="text-sm text-blue-700">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {citas.map((cita) => (
              <div key={cita.id} className="bg-card border border-border rounded-lg p-6 shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg text-card-foreground">{cita.paciente}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="w-4 h-4" />
                      {cita.hora}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      cita.estado === 'en-atencion'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {cita.estado === 'en-atencion' ? 'En atención' : 'Pendiente'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  <p>Motivo: {cita.motivo}</p>
                </div>
                <button
                  type="button"
                  onClick={() => atenderCita(cita.id)}
                  className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Atender paciente
                </button>
              </div>
            ))}
          </div>

          {citas.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No tiene citas programadas para hoy en la demo.</p>
            </div>
          )}
        </div>
      )}

      {vistaActiva === 'historial' && (
        <div className="space-y-6">
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <div className="mb-4">
              <label className="block text-sm mb-2 text-card-foreground">Seleccionar Paciente</label>
              <select
                value={pacienteSeleccionado}
                onChange={(e) => setPacienteSeleccionado(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Seleccione un paciente...</option>
                {pacientes.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {pacienteSeleccionado && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-card-foreground">Historial de {pacienteSeleccionado}</h3>
                  <button
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-5 h-5" />
                    Nueva Consulta
                  </button>
                </div>

                {mostrarFormulario && (
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <form onSubmit={handleSubmitHistorial} className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2 text-card-foreground">Diagnóstico</label>
                        <textarea
                          value={formHistorial.diagnostico}
                          onChange={(e) => setFormHistorial({ ...formHistorial, diagnostico: e.target.value })}
                          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          rows={2}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2 text-card-foreground">Tratamiento</label>
                        <textarea
                          value={formHistorial.tratamiento}
                          onChange={(e) => setFormHistorial({ ...formHistorial, tratamiento: e.target.value })}
                          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          rows={2}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2 text-card-foreground">Observaciones</label>
                        <textarea
                          value={formHistorial.observaciones}
                          onChange={(e) => setFormHistorial({ ...formHistorial, observaciones: e.target.value })}
                          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          rows={2}
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Save className="w-5 h-5" />
                          Guardar Consulta
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
                  {historiales[pacienteSeleccionado]?.map((consulta) => (
                    <div key={consulta.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(consulta.fecha).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
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
                    </div>
                  ))}
                </div>
              </>
            )}

            {!pacienteSeleccionado && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Seleccione un paciente para ver su historial</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
