import { useState } from 'react';
import { FileText, Search, Plus, Pill, Activity } from 'lucide-react';

interface Consulta {
  id: number;
  fecha: string;
  medico: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
}

interface HistorialPaciente {
  paciente: string;
  edad: number;
  grupoSanguineo: string;
  alergias: string;
  consultas: Consulta[];
}

export function HistorialClinico() {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    fecha: '',
    medico: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: ''
  });

  const pacientes = [
    'Juan Pérez',
    'María López',
    'Carlos Sánchez'
  ];

  const [historiales] = useState<Record<string, HistorialPaciente>>({
    'Juan Pérez': {
      paciente: 'Juan Pérez',
      edad: 41,
      grupoSanguineo: 'O+',
      alergias: 'Penicilina',
      consultas: [
        {
          id: 1,
          fecha: '2026-04-15',
          medico: 'Dr. García',
          diagnostico: 'Hipertensión arterial',
          tratamiento: 'Enalapril 10mg - 1 vez al día',
          observaciones: 'Control en 30 días'
        },
        {
          id: 2,
          fecha: '2026-03-10',
          medico: 'Dr. Rodríguez',
          diagnostico: 'Consulta preventiva',
          tratamiento: 'Vitaminas - Complejo B',
          observaciones: 'Paciente en buen estado general'
        }
      ]
    },
    'María López': {
      paciente: 'María López',
      edad: 36,
      grupoSanguineo: 'A+',
      alergias: 'Ninguna',
      consultas: [
        {
          id: 1,
          fecha: '2026-04-20',
          medico: 'Dra. Martínez',
          diagnostico: 'Control prenatal',
          tratamiento: 'Ácido fólico - Suplementos vitamínicos',
          observaciones: 'Embarazo normal, 12 semanas'
        }
      ]
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({
      fecha: '',
      medico: '',
      diagnostico: '',
      tratamiento: '',
      observaciones: ''
    });
    setMostrarFormulario(false);
  };

  const historialActual = pacienteSeleccionado ? historiales[pacienteSeleccionado] : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-foreground mb-2">Historial Clínico</h2>
          <p className="text-muted-foreground">Consulta y registro de historiales médicos</p>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6 border border-border">
        <div className="mb-6">
          <label className="block text-sm mb-2 text-card-foreground">Seleccionar Paciente</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={pacienteSeleccionado}
              onChange={(e) => setPacienteSeleccionado(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Seleccione un paciente...</option>
              {pacientes.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {historialActual && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-900">Paciente</span>
                </div>
                <p className="text-lg text-blue-900">{historialActual.paciente}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-900">Edad</span>
                </div>
                <p className="text-lg text-green-900">{historialActual.edad} años</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-purple-900">Grupo Sanguíneo</span>
                </div>
                <p className="text-lg text-purple-900">{historialActual.grupoSanguineo}</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-900">Alergias</span>
                </div>
                <p className="text-lg text-red-900">{historialActual.alergias}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-card-foreground">Consultas Médicas</h3>
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
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="block text-sm mb-2 text-card-foreground">Médico</label>
                    <input
                      type="text"
                      value={formData.medico}
                      onChange={(e) => setFormData({ ...formData, medico: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2 text-card-foreground">Diagnóstico</label>
                    <textarea
                      value={formData.diagnostico}
                      onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={2}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2 text-card-foreground">Tratamiento</label>
                    <textarea
                      value={formData.tratamiento}
                      onChange={(e) => setFormData({ ...formData, tratamiento: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={2}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2 text-card-foreground">Observaciones</label>
                    <textarea
                      value={formData.observaciones}
                      onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={2}
                    />
                  </div>

                  <div className="md:col-span-2 flex gap-4">
                    <button
                      type="submit"
                      className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
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
              {historialActual.consultas.map((consulta) => (
                <div key={consulta.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-card-foreground">{consulta.medico}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(consulta.fecha).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 ml-13">
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
            <p>Seleccione un paciente para ver su historial clínico</p>
          </div>
        )}
      </div>
    </div>
  );
}
