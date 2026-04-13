function validacion_get() {
  const i = SheetService.readObjects_(APP_CONFIG.SHEETS.INDICADORES);
  const a = SheetService.readObjects_(APP_CONFIG.SHEETS.ACTIVIDADES);
  const r = SheetService.readObjects_(APP_CONFIG.SHEETS.RIESGOS);
  const c = SheetService.readObjects_(APP_CONFIG.SHEETS.CAPACITACIONES);

  return[
    { titulo: 'Formato A: Indicadores', cantidad: i.length, listo: i.length > 0 },
    { titulo: 'Formato B: Actividades', cantidad: a.length, listo: a.length > 0 },
    { titulo: 'Formato C: Riesgos', cantidad: r.length, listo: r.length > 0 },
    { titulo: 'Formato D: Capacitaciones', cantidad: c.length, listo: c.length > 0 }
  ];
}

function validacion_submit() {
  const session = Auth.getSession();
  SheetService.saveObject_(APP_CONFIG.SHEETS.REVISIONES, {
    id: Utilities.getUuid(),
    usuario: session.email,
    fecha: new Date(),
    estado: 'ENVIADO',
    comentario: 'Envío finalizado por el usuario.'
  });
  return { success: true, message: 'Su información ha sido enviada a Planificación exitosamente.' };
}