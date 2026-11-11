import { useState } from 'react';
import { Calendar, FileText, Download, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { downloadComprobantePago, downloadHistorialClinico } from '../lib/download';

interface CitaPaciente {
  id: number;
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: string;
  metodoPago: string;
  monto: number;
}

interface HistorialConsulta {
  id: number;
  fecha: string;
  medico: string;
  diagnostico: string;
  tratamiento: string;
}

export function PortalPaciente({ nombrePaciente }: { nombrePaciente: string }) {
  const [vistaActiva, setVistaActiva] = useState('mis-citas');
  const [mostrarAgendarCita, setMostrarAgendarCita] = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaPaciente | null>(null);

  const [formCita, setFormCita] = useState({
    medico: '',
    fecha: '',
    hora: '',
    motivo: '',
    metodoPago: 'tarjeta'
  });

  const [pagoData, setPagoData] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    fechaVencimiento: '',
    cvv: ''
  });

  const [misCitas, setMisCitas] = useState<CitaPaciente[]>([
    {
      id: 1,
      medico: 'Dr. García',
      especialidad: 'Medicina General',
      fecha: '2026-05-05',
      hora: '10:00',
      motivo: 'Consulta general',
      estado: 'confirmada',
      metodoPago: 'Tarjeta',
      monto: 150
    },
    {
      id: 2,
      medico: 'Dr. Rodríguez',
      especialidad: 'Cardiología',
      fecha: '2026-04-28',
      hora: '14:00',
      motivo: 'Control cardiológico',
      estado: 'completada',
      metodoPago: 'Billetera Digital',
      monto: 200
    }
  ]);

  const [historial] = useState<HistorialConsulta[]>([
    {
      id: 1,
      fecha: '2026-04-28',
      medico: 'Dr. Rodríguez',
      diagnostico: 'Presión arterial controlada',
      tratamiento: 'Continuar con medicación actual'
    },
    {
      id: 2,
      fecha: '2026-03-15',
      medico: 'Dr. García',
      diagnostico: 'Gripe común',
      tratamiento: 'Paracetamol 500mg cada 8 horas'
    }
  ]);

  const medicos = [
    'Dr. García - Medicina General',
    'Dr. Rodríguez - Cardiología',
    'Dra. Martínez - Pediatría',
    'Dr. Silva - Traumatología'
  ];

  const horasDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleAgendarCita = (e: React.FormEvent) => {
    e.preventDefault();
    const medicoSeleccionado = medicos.find(m => m === formCita.medico);
    const especialidad = medicoSeleccionado?.split(' - ')[1] || 'General';
    const monto = especialidad === 'Medicina General' ? 150 : 200;

    const nuevaCita: CitaPaciente = {
      id: misCitas.length + 1,
      medico: formCita.medico.split(' - ')[0],
      especialidad: especialidad,
      fecha: formCita.fecha,
      hora: formCita.hora,
      motivo: formCita.motivo,
      estado: 'pendiente-pago',
      metodoPago: formCita.metodoPago,
      monto: monto
    };

    setCitaSeleccionada(nuevaCita);
    setMostrarPago(true);
  };

  const handlePago = (e: React.FormEvent) => {
    e.preventDefault();
    if (citaSeleccionada) {
      setMisCitas([...misCitas, { ...citaSeleccionada, estado: 'confirmada' }]);
      toast.success('Cita confirmada y pago registrado');
      setMostrarPago(false);
      setMostrarAgendarCita(false);
      setCitaSeleccionada(null);
      setFormCita({
        medico: '',
        fecha: '',
        hora: '',
        motivo: '',
        metodoPago: 'tarjeta',
      });
      setPagoData({
        numeroTarjeta: '',
        nombreTitular: '',
        fechaVencimiento: '',
        cvv: '',
      });
    }
  };

  const descargarPDFHistorial = () => {
    downloadHistorialClinico({
      paciente: nombrePaciente,
      consultas: historial.map((h) => ({
        fecha: h.fecha,
        medico: h.medico,
        diagnostico: h.diagnostico,
        tratamiento: h.tratamiento,
      })),
    });
    toast.success('Historial descargado');
  };

  const descargarPDFPago = (cita: CitaPaciente) => {
    downloadComprobantePago({
      numero: `CITA-${cita.id}`,
      paciente: nombrePaciente,
      servicio: cita.especialidad,
      monto: cita.monto,
      metodoPago: cita.metodoPago,
      fecha: cita.fecha,
    });
    toast.success('Comprobante descargado');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-foreground mb-2">Portal del Paciente</h2>
        <p className="text-muted-foreground">Bienvenido, {nombrePaciente}</p>
      </div>

      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setVistaActiva('mis-citas')}
          className={`px-4 py-2 ${
            vistaActiva === 'mis-citas'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Mis Citas
        </button>
        <button
          onClick={() => setVistaActiva('historial')}
          className={`px-4 py-2 ${
            vistaActiva === 'historial'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Historial Clínico
        </button>
        <button
          onClick={() => setVistaActiva('pagos')}
          className={`px-4 py-2 ${
            vistaActiva === 'pagos'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Mis Pagos
        </button>
      </div>

      {vistaActiva === 'mis-citas' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-card-foreground">Mis Citas Médicas</h3>
            <button
              onClick={() => setMostrarAgendarCita(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Calendar className="w-5 h-5" />
              Agendar Nueva Cita
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {misCitas.map((cita) => (
              <div key={cita.id} className="bg-card border border-border rounded-lg p-6 shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg text-card-foreground">{cita.medico}</h4>
                    <p className="text-sm text-muted-foreground">{cita.especialidad}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    cita.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                    cita.estado === 'completada' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {cita.estado === 'confirmada' ? 'Confirmada' :
                     cita.estado === 'completada' ? 'Completada' : 'Pendiente'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-card-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(cita.fecha).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center gap-2 text-card-foreground">
                    <Clock className="w-4 h-4" />
                    {cita.hora}
                  </div>
                  <div className="text-muted-foreground">
                    Motivo: {cita.motivo}
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-card-foreground">S/ {cita.monto}</span>
                    <span className="text-muted-foreground text-xs">{cita.metodoPago}</span>
                  </div>
                </div>
                {cita.estado === 'completada' && (
                  <button
                    onClick={() => descargarPDFPago(cita)}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                    Descargar Comprobante
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {vistaActiva === 'historial' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-card-foreground">Mi Historial Clínico</h3>
            <button
              onClick={descargarPDFHistorial}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Download className="w-5 h-5" />
              Descargar Historial PDF
            </button>
          </div>

          <div className="space-y-4">
            {historial.map((consulta) => (
              <div key={consulta.id} className="bg-card border border-border rounded-lg p-6 shadow">
                <div className="flex items-center justify-between mb-4">
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
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Diagnóstico:</span>
                    <p className="text-card-foreground">{consulta.diagnostico}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Tratamiento:</span>
                    <p className="text-card-foreground">{consulta.tratamiento}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {vistaActiva === 'pagos' && (
        <div className="space-y-6">
          <h3 className="text-lg text-card-foreground">Mis Pagos</h3>
          <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left py-3 px-4 text-muted-foreground">Fecha</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Servicio</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Método</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Monto</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">PDF</th>
                </tr>
              </thead>
              <tbody>
                {misCitas.filter(c => c.estado === 'completada').map((cita) => (
                  <tr key={cita.id} className="border-b border-border">
                    <td className="py-3 px-4 text-card-foreground">
                      {new Date(cita.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4 text-card-foreground">{cita.especialidad}</td>
                    <td className="py-3 px-4 text-card-foreground">{cita.metodoPago}</td>
                    <td className="py-3 px-4 text-card-foreground">S/ {cita.monto}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => descargarPDFPago(cita)}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Descargar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mostrarAgendarCita && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full border border-border max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg mb-4 text-card-foreground">Agendar Nueva Cita</h3>
            <form onSubmit={handleAgendarCita} className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-card-foreground">Médico y Especialidad</label>
                <select
                  value={formCita.medico}
                  onChange={(e) => setFormCita({ ...formCita, medico: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Seleccione...</option>
                  {medicos.map((m, i) => (
                    <option key={i} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-card-foreground">Fecha</label>
                <input
                  type="date"
                  value={formCita.fecha}
                  onChange={(e) => setFormCita({ ...formCita, fecha: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-card-foreground">Hora</label>
                <select
                  value={formCita.hora}
                  onChange={(e) => setFormCita({ ...formCita, hora: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Seleccione...</option>
                  {horasDisponibles.map((h, i) => (
                    <option key={i} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-card-foreground">Motivo</label>
                <textarea
                  value={formCita.motivo}
                  onChange={(e) => setFormCita({ ...formCita, motivo: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-card-foreground">Método de Pago</label>
                <select
                  value={formCita.metodoPago}
                  onChange={(e) => setFormCita({ ...formCita, metodoPago: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="billetera">Billetera Digital</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Continuar al Pago
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarAgendarCita(false)}
                  className="px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarPago && citaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full border border-border">
            <h3 className="text-lg mb-4 text-card-foreground">Procesar Pago Online</h3>
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Médico: {citaSeleccionada.medico}</p>
              <p className="text-sm text-muted-foreground">Especialidad: {citaSeleccionada.especialidad}</p>
              <p className="text-2xl text-card-foreground mt-2">S/ {citaSeleccionada.monto}</p>
            </div>

            <form onSubmit={handlePago} className="space-y-4">
              {formCita.metodoPago === 'tarjeta' && (
                <>
                  <div>
                    <label className="block text-sm mb-2 text-card-foreground">Número de Tarjeta</label>
                    <input
                      type="text"
                      value={pagoData.numeroTarjeta}
                      onChange={(e) => setPagoData({ ...pagoData, numeroTarjeta: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-card-foreground">Nombre del Titular</label>
                    <input
                      type="text"
                      value={pagoData.nombreTitular}
                      onChange={(e) => setPagoData({ ...pagoData, nombreTitular: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 text-card-foreground">Vencimiento</label>
                      <input
                        type="text"
                        value={pagoData.fechaVencimiento}
                        onChange={(e) => setPagoData({ ...pagoData, fechaVencimiento: e.target.value })}
                        placeholder="MM/AA"
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-card-foreground">CVV</label>
                      <input
                        type="text"
                        value={pagoData.cvv}
                        onChange={(e) => setPagoData({ ...pagoData, cvv: e.target.value })}
                        placeholder="123"
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {formCita.metodoPago === 'billetera' && (
                <div>
                  <label className="block text-sm mb-2 text-card-foreground">Número de Celular</label>
                  <input
                    type="tel"
                    placeholder="999 999 999"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Se enviará una solicitud de pago a tu Yape/Plin
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirmar Pago S/ {citaSeleccionada.monto}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarPago(false);
                    setCitaSeleccionada(null);
                  }}
                  className="px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
