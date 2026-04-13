/**
 * FormatoA_g.gs - Módulo de Indicadores Institucionales
 */

function indicadores_list() {
  const data = SheetService.readObjects_(APP_CONFIG.SHEETS.INDICADORES);
  
  return data.map(it => {
    const meta = Number(it.metaAnual || it.meta_anual || 0);
    const result = Number(it.resultadoSemestre || it.resultado_semestre || 0);
    const avance = meta > 0 ? Math.min(100, Math.round((result / meta) * 100)) : 0;

    return {
      id: it.id,
      nombre: it.nombre,
      responsable: it.responsable,
      metaAnual: meta,
      resultadoSemestre: result,
      avance: avance,
      fuente: it.fuente,
      detallesFuente: it.detalles_fuente || it.detallesFuente,
      enlace: it.enlace_url || it.enlace,
      estado: it.estado || 'Borrador',
      fechaRegistro: it.fecha_registro || it.fechaRegistro
    };
  });
}

function indicadores_guardar_borrador(data) {
  try {
    const isEdit = !!data.id;
    const rowData = {
      id: data.id || Utilities.getUuid(),
      nombre: data.nombre,
      responsable: data.responsable,
      metaAnual: data.metaAnual,
      meta_anual: data.metaAnual,
      resultadoSemestre: data.resultadoSemestre,
      resultado_semestre: data.resultadoSemestre,
      fuente: data.fuente,
      detallesFuente: data.detallesFuente,
      detalles_fuente: data.detallesFuente,
      enlace: data.enlace,
      enlace_url: data.enlace,
      estado: 'Borrador',
      fechaRegistro: new Date(),
      fecha_registro: new Date()
    };

    if (isEdit) {
      const success = SheetService.updateObjectById_(APP_CONFIG.SHEETS.INDICADORES, data.id, rowData);
      return { success };
    } else {
      SheetService.saveObject_(APP_CONFIG.SHEETS.INDICADORES, rowData);
      return { success: true };
    }
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Compatibilidad
function formatoA_getData() { return indicadores_list(); }
function formatoA_getSummary() {
  const items = indicadores_list();
  const total = items.length;
  const avgAvance = total ? (items.reduce((acc, it) => acc + it.avance, 0) / total).toFixed(1) : 0;
  
  return {
    totalIndicadores: { valor: total, tendencia: '+0%' },
    avancePromedio: { valor: avgAvance + '%', tendencia: '+0%' },
    revisionesPendientes: { valor: items.filter(i => i.estado !== 'Aprobado').length, tendencia: '0' }
  };
}
function formatoA_saveRecord(data) { return indicadores_guardar_borrador(data); }
