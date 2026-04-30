import { useState } from 'react';
import { CreditCard, FileText, Download, DollarSign, Check } from 'lucide-react';

interface Factura {
  id: number;
  numero: string;
  paciente: string;
  servicio: string;
  monto: number;
  fecha: string;
  estado: 'pendiente' | 'pagada' | 'anulada';
  metodoPago?: string;
}

export function PagosFacturacion() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [formData, setFormData] = useState({
    paciente: '',
    servicio: '',
    monto: '',
    descripcion: ''
  });

  const [pagoData, setPagoData] = useState({
    metodoPago: 'tarjeta',
    numeroTarjeta: '',
    nombreTitular: '',
    fechaVencimiento: '',
    cvv: ''
  });

  const [facturas, setFacturas] = useState<Factura[]>([
    {
      id: 1,
      numero: 'F001-00001',
      paciente: 'Juan Pérez',
      servicio: 'Consulta General',
      monto: 150,
      fecha: '2026-04-30',
      estado: 'pendiente'
    },
    {
      id: 2,
      numero: 'F001-00002',
      paciente: 'María López',
      servicio: 'Control Prenatal',
      monto: 200,
      fecha: '2026-04-29',
      estado: 'pagada',
      metodoPago: 'Tarjeta de Crédito'
    },
    {
      id: 3,
      numero: 'F001-00003',
      paciente: 'Carlos Sánchez',
      servicio: 'Examen de Laboratorio',
      monto: 80,
      fecha: '2026-04-28',
      estado: 'pagada',
      metodoPago: 'Efectivo'
    }
  ]);

  const pacientes = ['Juan Pérez', 'María López', 'Carlos Sánchez'];
  const servicios = [
    'Consulta General',
    'Consulta Especializada',
    'Examen de Laboratorio',
    'Control Prenatal',
    'Procedimiento Menor'
  ];

  const handleSubmitFactura = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaFactura: Factura = {
      id: facturas.length + 1,
      numero: `F001-${String(facturas.length + 1).padStart(5, '0')}`,
      paciente: formData.paciente,
      servicio: formData.servicio,
      monto: parseFloat(formData.monto),
      fecha: new Date().toISOString().split('T')[0],
      estado: 'pendiente'
    };
    setFacturas([...facturas, nuevaFactura]);
    setFormData({ paciente: '', servicio: '', monto: '', descripcion: '' });
    setMostrarFormulario(false);
  };

  const handleSubmitPago = (e: React.FormEvent) => {
    e.preventDefault();
    if (facturaSeleccionada) {
      const facturasActualizadas = facturas.map(f =>
        f.id === facturaSeleccionada.id
          ? { ...f, estado: 'pagada' as const, metodoPago: pagoData.metodoPago === 'tarjeta' ? 'Tarjeta de Crédito' : 'Efectivo' }
          : f
      );
      setFacturas(facturasActualizadas);
      setPagoData({
        metodoPago: 'tarjeta',
        numeroTarjeta: '',
        nombreTitular: '',
        fechaVencimiento: '',
        cvv: ''
      });
      setMostrarPago(false);
      setFacturaSeleccionada(null);
    }
  };

  const iniciarPago = (factura: Factura) => {
    setFacturaSeleccionada(factura);
    setMostrarPago(true);
  };

  const totalIngresos = facturas
    .filter(f => f.estado === 'pagada')
    .reduce((sum, f) => sum + f.monto, 0);

  const totalPendiente = facturas
    .filter(f => f.estado === 'pendiente')
    .reduce((sum, f) => sum + f.monto, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-foreground mb-2">Pagos y Facturación</h2>
          <p className="text-muted-foreground">Gestión de cobros y emisión de comprobantes</p>
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <FileText className="w-5 h-5" />
          Nueva Factura
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Total Ingresos</p>
              <p className="text-2xl">S/ {totalIngresos.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Pendiente de Cobro</p>
              <p className="text-2xl">S/ {totalPendiente.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Facturas Emitidas</p>
              <p className="text-2xl">{facturas.length}</p>
            </div>
          </div>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="bg-card rounded-lg shadow p-6 border border-border">
          <h3 className="text-lg mb-4 text-card-foreground">Nueva Factura</h3>
          <form onSubmit={handleSubmitFactura} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm mb-2 text-card-foreground">Servicio</label>
              <select
                value={formData.servicio}
                onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Seleccione un servicio</option>
                {servicios.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">Monto (S/)</label>
              <input
                type="number"
                step="0.01"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-card-foreground">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <FileText className="w-5 h-5" />
                Generar Factura
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

      {mostrarPago && facturaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="text-lg mb-4 text-card-foreground">Procesar Pago</h3>
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Factura: {facturaSeleccionada.numero}</p>
              <p className="text-sm text-muted-foreground">Paciente: {facturaSeleccionada.paciente}</p>
              <p className="text-2xl text-card-foreground mt-2">S/ {facturaSeleccionada.monto.toFixed(2)}</p>
            </div>

            <form onSubmit={handleSubmitPago} className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-card-foreground">Método de Pago</label>
                <select
                  value={pagoData.metodoPago}
                  onChange={(e) => setPagoData({ ...pagoData, metodoPago: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="efectivo">Efectivo</option>
                </select>
              </div>

              {pagoData.metodoPago === 'tarjeta' && (
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

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="w-5 h-5" />
                  Confirmar Pago
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarPago(false);
                    setFacturaSeleccionada(null);
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

      <div className="bg-card rounded-lg shadow p-6 border border-border">
        <h3 className="text-lg mb-4 text-card-foreground">Facturas Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground">Número</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Paciente</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Servicio</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Monto</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Fecha</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Estado</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura) => (
                <tr key={factura.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4 text-card-foreground">{factura.numero}</td>
                  <td className="py-3 px-4 text-card-foreground">{factura.paciente}</td>
                  <td className="py-3 px-4 text-card-foreground">{factura.servicio}</td>
                  <td className="py-3 px-4 text-card-foreground">S/ {factura.monto.toFixed(2)}</td>
                  <td className="py-3 px-4 text-card-foreground">
                    {new Date(factura.fecha).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      factura.estado === 'pagada' ? 'bg-green-100 text-green-800' :
                      factura.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {factura.estado === 'pendiente' && (
                        <button
                          onClick={() => iniciarPago(factura)}
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          title="Procesar Pago"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="p-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
                        title="Descargar"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
