function formatoA_get() {
  const data = SheetService.readObjects_(APP_CONFIG.SHEETS.INDICADORES);
  return data.map(it => {
    // Busca múltiples posibles nombres de columna por seguridad
    const meta = Number(it.metaanual || it.meta_anual || it.meta || 0);
    const result = Number(it.resultadosemestre || it.resultado_semestre || it.resultado || 0);
    const avance = meta > 0 ? Math.min(100, Math.round((result / meta) * 100)) : 0;
    
    return {
      id: String(it.id || ''),
      nombre: it.nombre || '',
      responsable: it.responsable || '',
      metaAnual: meta,
      resultado: result,
      avance: avance,
      fuente: it.fuente || 'Manual',
      detallesFuente: it.detallesfuente || it.detalles_fuente || '',
      area: it.area || '',
      codAei: it.codaei || '',
      enlace: it.enlace || it.enlace_url || '',
      estado: it.estado || 'Borrador'
    };
  });
}

function formatoA_save(data) {
  try {
    const session = Auth.getSession();
    const isEdit = !!data.id;
    const rowData = {
      id: data.id || Utilities.getUuid(),
      nombre: data.nombre,
      responsable: data.responsable,
      metaanual: data.metaAnual,
      resultado: data.resultado,
      fuente: data.fuente,
      detallesfuente: data.detallesFuente,
      area: session.area || data.area || '', // ✅ Automático de sesión
      codaei: data.codAei,
      enlace: data.enlace,
      estado: 'Borrador'
    };

    if (isEdit) {
      return { success: SheetService.updateObjectById_(APP_CONFIG.SHEETS.INDICADORES, data.id, rowData) };
    } else {
      SheetService.saveObject_(APP_CONFIG.SHEETS.INDICADORES, rowData);
      return { success: true };
    }
  } catch(e) {
    return { success: false, message: String(e) };
  }
}