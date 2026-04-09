/**
 * FormatoA_g.gs
 * Lógica para la gestión de Indicadores Institucionales
 */

function formatoA_getData() {
  const session = Auth.getSession();
  const data = SheetService.readObjects_(APP_CONFIG.SHEETS.INDICADORES);
  
  return data.map(it => ({
    ...it,
    metaAnual: Number(it.metaAnual || 0),
    resultadoSemestre: Number(it.resultadoSemestre || 0),
    avance: Number(it.avance || 0)
  }));
}

function formatoA_getSummary() {
  const items = formatoA_getData();
  const total = items.length;
  const avgAvance = total ? (items.reduce((acc, it) => acc + it.avance, 0) / total).toFixed(1) : 0;
  
  return {
    totalIndicadores: { valor: total, tendencia: '+0%' },
    avancePromedio: { valor: avgAvance + '%', tendencia: '+0%' },
    revisionesPendientes: { valor: items.filter(i => i.estado !== 'Aprobado').length, tendencia: '0' }
  };
}

function formatoA_saveRecord(formData) {
  const session = Auth.getSession();
  
  // Generar ID si no existe
  if (!formData.id) {
    const timestamp = new Date().getTime();
    formData.id = 'IND-' + timestamp.toString().slice(-6);
  }
  
  formData.fechaCreacion = new Date();
  formData.estado = formData.estado || 'Borrador';
  
  // Calcular avance
  const meta = Number(formData.metaAnual || 0);
  const result = Number(formData.resultadoSemestre || 0);
  formData.avance = meta > 0 ? Math.min(100, Math.round((result / meta) * 100)) : 0;

  SheetService.saveObject_(APP_CONFIG.SHEETS.INDICADORES, formData);
  
  return { success: true, message: 'Indicador guardado correctamente en la base de datos.' };
}
