/**
 * FormatoC_g.gs
 * Lógica para la gestión de Riesgos y Brechas
 */

function formatoC_saveRisk(formData) {
  const session = Auth.getSession();
  console.log('Guardando Análisis de Riesgo:', formData);
  
  // Simulación
  Utilities.sleep(1200);
  return { 
    success: true, 
    message: 'El análisis de riesgo ha sido registrado exitosamente.',
    id: 'RSK-' + Math.floor(Math.random()*1000)
  };
}

function formatoC_getEvidences() {
  // Datos de ejemplo para el panel lateral
  return [
    { nombre: 'Evaluacion_Riesgo_Q1.pdf', tamano: '2.4 MB', tipo: 'pdf', id: 'ev-1' },
    { nombre: 'Portal de Auditoría Interna', url: 'https://interna.uac.edu/auditoria', tipo: 'link', id: 'ev-2' }
  ];
}
