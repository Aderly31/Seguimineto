/**
 * BandejaRevision_g.gs
 * Lógica real para la administración y revisión consolidada.
 */

function bandeja_getInbox() {
  const session = Auth.getSession();
  if (session.rol !== 'dipla' && session.rol !== 'admin') {
    throw new Error('Acceso restringido.');
  }

  // Obtenemos áreas únicas que han enviado información en cualquiera de los 4 formatos
  const dataA = formatoA_get();
  const dataB = formatoB_get();
  const dataC = formatoC_get();
  const dataD = formatoD_get();

  const allAreas = [...new Set([
    ...dataA.map(d => d.area),
    ...dataB.map(d => d.area),
    ...dataC.map(d => d.area),
    ...dataD.map(d => d.area)
  ])].filter(Boolean).sort();

  return {
    areas: allAreas,
    formatos: {
      A: dataA,
      B: dataB,
      C: dataC,
      D: dataD
    }
  };
}

function bandeja_updateStatus(area, status, comments) {
  const session = Auth.getSession();
  
  const log = {
    id: Utilities.getUuid(),
    timestamp: new Date(),
    area: area,
    revisorEmail: session.email,
    decision: status,
    comentarios: comments
  };
  
  SheetService.saveObject_(APP_CONFIG.SHEETS.REVISIONES, log);
  
  return { success: true, message: `El reporte de ${area} ha sido marcado como ${status}.` };
}

/**
 * Obtiene el historial de revisiones para un área
 */
function bandeja_getHistory(area) {
  const allLogs = SheetService.readObjects_(APP_CONFIG.SHEETS.REVISIONES);
  return allLogs
    .filter(l => l.area === area)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}
