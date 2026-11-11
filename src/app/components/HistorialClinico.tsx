import { useState } from 'react';
import { FileText, Search, Plus, Pill, Activity, Download } from 'lucide-react';
import { toast } from 'sonner';
import { downloadHistorialClinico } from '../lib/download';
import { formatDateOnly } from '../lib/dates';

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
    observaciones: '',
  });

  const pacientes = ['Juan Pérez', 'María López', 'Carlos Sánchez'];

  const [historiales, setHistoriales] = useState<Record<string, HistorialPaciente>>({
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
          observaciones: 'Control en 30 días',
        },
        {
          id: 2,
          fecha: '2026-03-10',
          medico: 'Dr. Rodríguez',
          diagnostico: 'Consulta preventiva',
          tratamiento: 'Vitaminas - Complejo B',
          observaciones: 'Paciente en buen estado general',
        },
      ],
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
          observaciones: 'Embarazo normal, 12 semanas',
        },
      ],
    },
    'Carlos Sánchez': {
      paciente: 'Carlos Sánchez',
      edad: 52,
      grupoSanguineo: 'B+',
      alergias: 'Ninguna',
      consultas: [],
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteSeleccionado) return;

    setHistoriales((prev) => {
      const actual = prev[pacienteSeleccionado];
      const nueva: Consulta = {
        id: (actual?.consultas.length ?? 0) + 1,
        ...formData,
      };
      return {
        ...prev,
        [pacienteSeleccionado]: {
          ...actual,
          consultas: [nueva, ...(actual?.consultas ?? [])],
        },
      };
    });

    toast.success('Consulta guardada en el historial');
    setFormData({
      fecha: '',
      medico: '',
      diagnostico: '',
      tratamiento: '',
      observaciones: '',
    });
    setMostrarFormulario(false);
  };

  const historialActual = pacienteSeleccionado ? historiales[pacienteSeleccionado] : null;

  const exportar = () => {
    if (!historialActual) return;
    downloadHistorialClinico({
      paciente: historialActual.paciente,
      consultas: historialActual.consultas.map((c) => ({
        fecha: c.fecha,
        medico: c.medico,
        diagnostico: c.diagnostico,
        tratamiento: c.tratamiento,
      })),
    });
    toast.success('Historial descargado');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl text-foreground mb-2">Historial Clínico</h2>
          <p className="text-muted-foreground">Consulta y registro de historiales médicos</p>
        </div>
        {historialActual && (
          <button
            type="button"
            onClick={exportar}
            className="flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors"
          >
            <Download className="w-5 h-5" aria-hidden="true" />
            Exportar historial
          </button>
        )}
      </div>

      <div className="bg-card rounded-lg shadow p-6 border border-border">
        <div className="mb-6">
          <label htmlFor="historial-paciente" className="block text-sm mb-2 text-card-foreground">
            Seleccionar paciente
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
              aria-hidden="true"
            />
            <select
              id="historial-paciente"
              value={pacienteSeleccionado}
              onChange={(e) => setPacienteSeleccionado(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Seleccione un paciente...</option>
              {pacientes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {historialActual && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  <span className="text-sm text-blue-900">Paciente</span>
                </div>
                <p className="text-lg text-blue-900">{historialActual.paciente}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-green-600" aria-hidden="true" />
                  <span className="text-sm text-green-900">Edad</span>
                </div>
                <p className="text-lg text-green-900">{historialActual.edad} años</p>
              </div>
              <div className="bg-sky-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-sky-700" aria-hidden="true" />
                  <span className="text-sm text-sky-900">Grupo sanguíneo</span>
                </div>
                <p className="text-lg text-sky-900">{historialActual.grupoSanguineo}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="w-5 h-5 text-red-600" aria-hidden="true" />
                  <span className="text-sm text-red-900">Alergias</span>
                </div>
                <p className="text-lg text-red-900">{historialActual.alergias}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <h3 className="text-lg text-card-foreground">Consultas médicas</h3>
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
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hc-fecha" className="block text-sm mb-2 text-card-foreground">
                      Fecha
                    </label>
                    <input
                      id="hc-fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="hc-medico" className="block text-sm mb-2 text-card-foreground">
                      Médico
                    </label>
                    <input
                      id="hc-medico"
                      type="text"
                      value={formData.medico}
                      onChange={(e) => setFormData({ ...formData, medico: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="hc-dx" className="block text-sm mb-2 text-card-foreground">
                      Diagnóstico
                    </label>
                    <textarea
                      id="hc-dx"
                      value={formData.diagnostico}
                      onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={2}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="hc-tx" className="block text-sm mb-2 text-card-foreground">
                      Tratamiento
                    </label>
                    <textarea
                      id="hc-tx"
                      value={formData.tratamiento}
                      onChange={(e) => setFormData({ ...formData, tratamiento: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={2}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="hc-obs" className="block text-sm mb-2 text-card-foreground">
                      Observaciones
                    </label>
                    <textarea
                      id="hc-obs"
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
              {historialActual.consultas.length === 0 && (
                <p className="text-muted-foreground text-center py-8">Sin consultas registradas.</p>
              )}
              {historialActual.consultas.map((consulta) => (
                <article
                  key={consulta.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-card-foreground">{consulta.medico}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateOnly(consulta.fecha)}
                      </p>
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
                </article>
              ))}
            </div>
          </>
        )}

        {!pacienteSeleccionado && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" aria-hidden="true" />
            <p>Seleccione un paciente para ver su historial clínico</p>
          </div>
        )}
      </div>
    </div>
  );
}
