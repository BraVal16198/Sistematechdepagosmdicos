/** Genera y descarga un archivo de texto/CSV en el navegador (demo sin backend). */
export function downloadTextFile(filename: string, content: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Escapa campos CSV y neutraliza prefijos de fórmula (=,+,-,@). */
export function csvEscape(value: string | number): string {
  let text = String(value);
  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function downloadComprobantePago(data: {
  numero?: string;
  paciente: string;
  servicio: string;
  monto: number;
  metodoPago: string;
  fecha: string;
}) {
  const lines = [
    'SISTEMA TECH — COMPROBANTE DE PAGO',
    '================================',
    `Número: ${data.numero ?? 'N/A'}`,
    `Paciente: ${data.paciente}`,
    `Servicio: ${data.servicio}`,
    `Monto: S/ ${data.monto.toFixed(2)}`,
    `Método: ${data.metodoPago}`,
    `Fecha: ${data.fecha}`,
    '',
    'Documento generado en modo demo. No tiene valor fiscal.',
  ];
  downloadTextFile(
    `comprobante-${(data.numero ?? data.paciente).replace(/\s+/g, '-')}.txt`,
    lines.join('\n')
  );
}

export function downloadHistorialClinico(data: {
  paciente: string;
  consultas: Array<{ fecha: string; medico: string; diagnostico: string; tratamiento: string }>;
}) {
  const body = data.consultas
    .map(
      (c, i) =>
        `#${i + 1} | ${c.fecha} | ${c.medico}\nDiagnóstico: ${c.diagnostico}\nTratamiento: ${c.tratamiento}\n`
    )
    .join('\n');
  downloadTextFile(
    `historial-${data.paciente.replace(/\s+/g, '-')}.txt`,
    `HISTORIAL CLÍNICO — ${data.paciente}\n\n${body}\nDocumento generado en modo demo.`
  );
}

export function downloadReporteCaja(data: {
  fecha: string;
  total: number;
  filas: Array<{ hora: string; paciente: string; servicio: string; metodoPago: string; monto: number }>;
}) {
  const header = 'hora,paciente,servicio,metodo,monto';
  const rows = data.filas
    .map((f) =>
      [
        csvEscape(f.hora),
        csvEscape(f.paciente),
        csvEscape(f.servicio),
        csvEscape(f.metodoPago),
        csvEscape(f.monto.toFixed(2)),
      ].join(',')
    )
    .join('\n');
  // 5 columnas: TOTAL en col1, monto en col5
  downloadTextFile(
    `caja-${data.fecha.replace(/\s+/g, '-')}.csv`,
    `${header}\n${rows}\n${csvEscape('TOTAL')},,,,${csvEscape(data.total.toFixed(2))}\n`,
    'text/csv;charset=utf-8'
  );
}
