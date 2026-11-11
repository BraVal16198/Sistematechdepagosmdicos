# Guidelines — Sistema Tech

## Alcance del demo

- Frontend SPA sin API. Persistencia solo en memoria / `sessionStorage`.
- No almacenar datos clínicos reales ni números de tarjeta auténticos.
- Los pagos son simulados; las descargas son TXT/CSV de demostración.

## Roles

1. **administrador** — acceso completo.
2. **admin** (administrativo) — citas, horarios, historial, caja.
3. **medico** — agenda y historiales.
4. **paciente** — portal de citas/pagos/historial.

## Calidad esperada

- Mantener `lang="es"`, meta SEO y cabeceras de seguridad en deploy.
- Preferir `htmlFor` / `aria-label` en controles nuevos.
- Usar toasts (`sonner`) en lugar de `alert()`.
- Tras cambios de UI, verificar login de los 4 roles demo.
