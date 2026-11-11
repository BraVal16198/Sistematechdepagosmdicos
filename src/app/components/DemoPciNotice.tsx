import { ShieldAlert } from 'lucide-react';

/** Aviso visible en formularios de tarjeta: no hay procesamiento real ni PCI. */
export function DemoPciNotice() {
  return (
    <div
      role="status"
      className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-950"
    >
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
      <div className="text-sm leading-relaxed">
        <p className="font-medium">DEMO — sin pagos reales ni cumplimiento PCI</p>
        <p className="mt-1 text-amber-900/90">
          Los campos de número de tarjeta (PAN), titular, vencimiento y CVV son solo para
          ilustrar la interfaz. No se envían a ninguna pasarela ni se almacenan de forma
          persistente.
        </p>
      </div>
    </div>
  );
}
