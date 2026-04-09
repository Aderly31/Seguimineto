/**
 * ValidacionEnvio_g.gs
 * Lógica para el flujo de validación y envío a Planificación
 */

function validacion_getSummary() {
  const session = Auth.getSession();
  
  // Datos de ejemplo basados en la captura (Imagen 7)
  return {
    progresoTotal: 75,
    pasos: [
      { id: 1, nombre: 'Formatos Completos', estado: 'COMPLETADO' },
      { id: 2, nombre: 'Evidencias Adjuntas', estado: 'COMPLETADO' },
      { id: 3, nombre: 'Validación Técnica', estado: 'ALERTA', detalle: 'ACCIÓN REQUERIDA' }
    ],
    formatos: [
      { 
        id: 'A', 
        titulo: 'Formato A: Objetivos Institucionales', 
        registros: '12 ítems', 
        evidencia: '1 Documento Adjunto', 
        valido: true 
      },
      { 
        id: 'B', 
        titulo: 'Formato B: Ejecución Presupuestal', 
        registros: 'S/ 1,245,600.00', 
        evidencia: 'Excel Cargado', 
        valido: true 
      },
      { 
        id: 'C', 
        titulo: 'Formato C: Avance Físico', 
        porcentaje: '65%', 
        alerta: 'Evidencia Faltante', 
        mensaje: 'La validación requiere un reporte PDF firmado.', 
        valido: false 
      }
    ],
    resumenFinal: {
      totalRegistros: 154,
      adjuntos: '2 / 4',
      alertas: 1
    }
  };
}

function validacion_getChecklist() {
  const session = Auth.getSession();
  
  // Verificación real de datos en las hojas
  const indicadores = SheetService.readObjects_(APP_CONFIG.SHEETS.INDICADORES);
  const actividades = SheetService.readObjects_(APP_CONFIG.SHEETS.ACTIVIDADES);
  const riesgos     = SheetService.readObjects_(APP_CONFIG.SHEETS.RIESGOS);
  const capacitaciones = SheetService.readObjects_(APP_CONFIG.SHEETS.CAPACITACIONES);

  return [
    { id: 'A', titulo: 'FORMATO A: INDICADORES', estado: indicadores.length > 0 ? 'COMPLETO' : 'PENDIENTE', info: indicadores.length + ' registros encontrados' },
    { id: 'B', titulo: 'FORMATO B: ACTIVIDADES', estado: actividades.length > 0 ? 'COMPLETO' : 'PENDIENTE', info: actividades.length + ' registros encontrados' },
    { id: 'C', titulo: 'FORMATO C: RIESGOS', estado: riesgos.length > 0 ? 'COMPLETO' : 'PENDIENTE', info: riesgos.length + ' registros encontrados' },
    { id: 'D', titulo: 'FORMATO D: CAPACITACIONES', estado: capacitaciones.length > 0 ? 'COMPLETO' : 'PENDIENTE', info: capacitaciones.length + ' registros encontrados' }
  ];
}

function validacion_submitFinal() {
  const session = Auth.getSession();
  
  // Registro de envío final en el historial de revisiones
  SheetService.saveObject_(APP_CONFIG.SHEETS.REVISIONES, {
    timestamp: new Date(),
    envioId: 'ENV-' + new Date().getTime(),
    facultad: 'Área de Usuario',
    revisorEmail: session.email,
    decision: 'ENVIADO',
    comentarios: 'Envío final realizado por el usuario desde el módulo de validación.'
  });

  return { success: true, message: '¡Felicidades! Su información ha sido enviada exitosamente a la oficina de Planificación.' };
}
