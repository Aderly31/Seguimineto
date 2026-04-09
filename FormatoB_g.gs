/**
 * FormatoC_g.gs
 * Lógica para la gestión de Riesgos y Brechas
 */

function formatoC_saveRisk(formData) {
  const session = Auth.getSession();
  if (!formData.id) formData.id = 'RSK-' + new Date().getTime().toString().slice(-6);
  formData.fechaCreacion = new Date();
  SheetService.saveObject_(APP_CONFIG.SHEETS.RIESGOS, formData);
  
  return { 
    success: true, 
    message: 'El análisis de riesgo ha sido registrado exitosamente.',
    id: formData.id
  };
}

function formatoC_getEvidences() {
  return [
    { nombre: 'Evaluacion_Riesgo_Q1.pdf', tamano: '2.4 MB', tipo: 'pdf', id: 'ev-1' },
    { nombre: 'Portal de Auditoría Interna', url: 'https://interna.uac.edu/auditoria', tipo: 'link', id: 'ev-2' }
  ];
}
