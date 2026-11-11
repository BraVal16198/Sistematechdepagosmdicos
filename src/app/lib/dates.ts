/** Parsea `YYYY-MM-DD` como medianoche local (evita desfase UTC). */
export function parseDateOnly(dateStr: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(`${dateStr}T00:00:00`);
  }
  return new Date(dateStr);
}

export function formatDateOnly(dateStr: string, locale = 'es-ES'): string {
  return parseDateOnly(dateStr).toLocaleDateString(locale);
}

/** Fecha local `YYYY-MM-DD` (no usar toISOString por el offset UTC). */
export function localYmd(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
