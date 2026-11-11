import { useState } from 'react';
import { Download, DollarSign, CreditCard, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { downloadReporteCaja } from '../lib/download';

interface PagoDelDia {
  id: number;
  hora: string;
  paciente: string;
  servicio: string;
  metodoPago: string;
  monto: number;
}

export function CajaDia() {
  const [cajaCerrada, setCajaCerrada] = useState(false);

  const fechaHoy = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const pagosDelDia: PagoDelDia[] = [
    {
      id: 1,
      hora: '09:30',
      paciente: 'Juan Pérez',
      servicio: 'Consulta General',
      metodoPago: 'Efectivo',
      monto: 150
    },
    {
      id: 2,
      hora: '11:00',
      paciente: 'María López',
      servicio: 'Cardiología',
      metodoPago: 'Tarjeta',
      monto: 200
    },
    {
      id: 3,
      hora: '14:30',
      paciente: 'Carlos Sánchez',
      servicio: 'Pediatría',
      metodoPago: 'Billetera Digital',
      monto: 180
    },
    {
      id: 4,
      hora: '16:00',
      paciente: 'Ana Torres',
      servicio: 'Consulta General',
      metodoPago: 'Efectivo',
      monto: 150
    }
  ];

  const totalEfectivo = pagosDelDia
    .filter(p => p.metodoPago === 'Efectivo')
    .reduce((sum, p) => sum + p.monto, 0);

  const totalTarjeta = pagosDelDia
    .filter(p => p.metodoPago === 'Tarjeta')
    .reduce((sum, p) => sum + p.monto, 0);

  const totalBilletera = pagosDelDia
    .filter(p => p.metodoPago === 'Billetera Digital')
    .reduce((sum, p) => sum + p.monto, 0);

  const totalGeneral = totalEfectivo + totalTarjeta + totalBilletera;

  const cerrarCaja = () => {
    setCajaCerrada(true);
    toast.success(`Caja cerrada. Total del día: S/ ${totalGeneral.toFixed(2)}`);
  };

  const descargarReporte = () => {
    downloadReporteCaja({
      fecha: new Date().toISOString().split('T')[0],
      total: totalGeneral,
      filas: pagosDelDia,
    });
    toast.success('Reporte de caja descargado (CSV)');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-foreground mb-2">Caja del Día</h2>
          <p className="text-muted-foreground capitalize">{fechaHoy}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={descargarReporte}
            className="flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors"
          >
            <Download className="w-5 h-5" />
            Descargar Reporte
          </button>
          <button
            type="button"
            onClick={cerrarCaja}
            disabled={cajaCerrada}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {cajaCerrada ? 'Caja cerrada' : 'Cerrar caja'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Total General</p>
              <p className="text-2xl">S/ {totalGeneral.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Efectivo</p>
              <p className="text-2xl">S/ {totalEfectivo.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Tarjetas</p>
              <p className="text-2xl">S/ {totalTarjeta.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Billeteras</p>
              <p className="text-2xl">S/ {totalBilletera.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6 border border-border">
        <h3 className="text-lg mb-4 text-card-foreground">Movimientos del Día</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground">Hora</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Paciente</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Servicio</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Método de Pago</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Monto</th>
              </tr>
            </thead>
            <tbody>
              {pagosDelDia.map((pago) => (
                <tr key={pago.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4 text-card-foreground">{pago.hora}</td>
                  <td className="py-3 px-4 text-card-foreground">{pago.paciente}</td>
                  <td className="py-3 px-4 text-card-foreground">{pago.servicio}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      pago.metodoPago === 'Efectivo' ? 'bg-blue-100 text-blue-800' :
                      pago.metodoPago === 'Tarjeta' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {pago.metodoPago}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-card-foreground">S/ {pago.monto.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-muted">
                <td colSpan={4} className="py-3 px-4 text-right font-medium text-card-foreground">
                  Total del Día:
                </td>
                <td className="py-3 px-4 font-bold text-green-600">
                  S/ {totalGeneral.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6 border border-border">
        <h3 className="text-lg mb-4 text-card-foreground">Resumen por Método de Pago</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Efectivo</p>
                <p className="text-xl text-blue-900">S/ {totalEfectivo.toFixed(2)}</p>
              </div>
              <div className="text-blue-700">
                <p className="text-sm">{pagosDelDia.filter(p => p.metodoPago === 'Efectivo').length} pagos</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Tarjeta</p>
                <p className="text-xl text-purple-900">S/ {totalTarjeta.toFixed(2)}</p>
              </div>
              <div className="text-purple-700">
                <p className="text-sm">{pagosDelDia.filter(p => p.metodoPago === 'Tarjeta').length} pagos</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Billetera Digital</p>
                <p className="text-xl text-yellow-900">S/ {totalBilletera.toFixed(2)}</p>
              </div>
              <div className="text-yellow-700">
                <p className="text-sm">{pagosDelDia.filter(p => p.metodoPago === 'Billetera Digital').length} pagos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
