/**
 * FormatoC_g.gs - Módulo de Riesgos y Brechas
 */

function riesgos_get_all() {
  const data = SheetService.readObjects_(APP_CONFIG.SHEETS.RIESGOS);
  return data.map(it => ({
    id: it.id,
    brecha: it.brecha || it.riesgo,
    causa: it.causa,
    impacto: it.impacto,
    accion: it.accion || it.accion_propuesta,
    estado: it.estado || 'Pendiente',
    fecha: it.fecha || it.fecha_objetivo,
    enlace: it.enlace || it.enlace_url
  }));
}

function riesgos_guardar(data) {
  try {
    const isEdit = !!data.id;
    const rowData = {
      id: data.id || Utilities.getUuid(),
      brecha: data.brecha,
      causa: data.causa,
      impacto: data.impacto,
      accion: data.accion,
      estado: data.estado,
      fecha: data.fecha,
      enlace: data.enlace,
      fecha_registro: new Date()
    };

    if (isEdit) {
      const success = SheetService.updateObjectById_(APP_CONFIG.SHEETS.RIESGOS, data.id, rowData);
      return { success };
    } else {
      SheetService.saveObject_(APP_CONFIG.SHEETS.RIESGOS, rowData);
      return { success: true };
    }
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}
