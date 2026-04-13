function formatoD_get() {
  try {
    const data = SheetService.readObjects_(APP_CONFIG.SHEETS.CAPACITACIONES);
    return data.map(it => {
      let fechaSegura = '';
      if (it.fecha instanceof Date) {
        fechaSegura = Utilities.formatDate(it.fecha, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      } else {
        fechaSegura = String(it.fecha || '');
      }

      return {
        id: String(it.id || ''), 
        nombre: String(it.nombre || ''), 
        fecha: fechaSegura,
        modalidad: String(it.modalidad || 'Virtual'), 
        participantes: Number(it.participantes || 0),
        progresoEvidencia: String(it.progresoEvidencia || ''),
        estado: String(it.estado || 'Programado')
      };
    });
  } catch(err) {
    throw new Error("Error leyendo capacitaciones: " + err.message);
  }
}

function formatoD_save(data) {
  try {
    const rowData = {
      id: data.id || Utilities.getUuid(),
      nombre: data.nombre,
      fecha: data.fecha,
      modalidad: data.modalidad,
      participantes: data.participantes,
      progresoEvidencia: data.progresoEvidencia || '',
      estado: data.estado || 'Programado',
      fechaCreacion: new Date()
    };
    
    if (data.id) return { success: SheetService.updateObjectById_(APP_CONFIG.SHEETS.CAPACITACIONES, data.id, rowData) };
    SheetService.saveObject_(APP_CONFIG.SHEETS.CAPACITACIONES, rowData); 
    return { success: true };
  } catch(e) { return { success: false, message: String(e) }; }
}