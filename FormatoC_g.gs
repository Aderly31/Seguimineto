function formatoC_get() {
  try {
    const data = SheetService.readObjects_(APP_CONFIG.SHEETS.RIESGOS);
    return data.map(it => {
      // Conversión de fecha segura para evitar que Apps Script se rompa
      let fechaSegura = '';
      if (it.fechaObjetivo instanceof Date) {
        fechaSegura = Utilities.formatDate(it.fechaObjetivo, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      } else {
        fechaSegura = String(it.fechaObjetivo || '');
      }

      return {
        id: String(it.id || ''), 
        riesgo: String(it.riesgo || ''), 
        causa: String(it.causa || ''),
        impacto: String(it.impacto || ''), 
        prioridad: String(it.prioridad || 'Media'), 
        accion: String(it.accion || ''),
        estado: String(it.estado || 'Pendiente'), 
        area: it.area || '',
        codAei: it.codaei || '',
        fechaObjetivo: fechaSegura
      };
    });
  } catch (err) {
    throw new Error("Error leyendo riesgos: " + err.message);
  }
}

function formatoC_save(data) {
  try {
    const rowData = {
      id: data.id || Utilities.getUuid(),
      riesgo: data.riesgo,
      causa: data.causa,
      impacto: data.impacto,
      prioridad: data.prioridad,
      accion: data.accion,
      estado: data.estado || 'Pendiente',
      area: data.area,
      codaei: data.codAei,
      fechaObjetivo: data.fechaObjetivo,
      fechaCreacion: new Date()
    };
    
    if (data.id) return { success: SheetService.updateObjectById_(APP_CONFIG.SHEETS.RIESGOS, data.id, rowData) };
    SheetService.saveObject_(APP_CONFIG.SHEETS.RIESGOS, rowData); 
    return { success: true };
  } catch(e) { 
    return { success: false, message: String(e) }; 
  }
}