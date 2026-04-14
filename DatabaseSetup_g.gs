/**
 * DatabaseSetup_g.gs
 * Función para inicializar las hojas y encabezados.
 * Ejecutar db_init() una sola vez desde el editor de Apps Script.
 */

function db_init() {
  const ss = SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID);
  
  const schema = [
    { 
      name: APP_CONFIG.SHEETS.INDICADORES, 
      headers: ['id', 'nombre', 'area', 'codAei', 'metaAnual', 'resultadoSemestre', 'avance', 'estado', 'responsable', 'fuente', 'detallesfuente', 'enlace', 'fechaCreacion'] 
    },
    { 
      name: APP_CONFIG.SHEETS.ACTIVIDADES, 
      headers: ['id', 'titulo', 'area', 'codAei', 'descripcion', 'impacto', 'estado', 'imagen', 'fechaCreacion'] 
    },
    { 
      name: APP_CONFIG.SHEETS.RIESGOS, 
      headers: ['id', 'riesgo', 'area', 'codAei', 'causa', 'impacto', 'prioridad', 'accion', 'estado', 'fechaObjetivo', 'fechaCreacion'] 
    },
    { 
      name: APP_CONFIG.SHEETS.CAPACITACIONES, 
      headers: ['id', 'nombre', 'area', 'codAei', 'fecha', 'modalidad', 'participantes', 'progresoEvidencia', 'estado', 'fechaCreacion'] 
    },
    { 
      name: APP_CONFIG.SHEETS.REVISIONES, 
      headers: ['timestamp', 'envioId', 'facultad', 'revisorEmail', 'decision', 'comentarios'] 
    },
    {
      name: APP_CONFIG.SHEETS.AREAS,
      headers: ['area', 'descripcion', 'dependencia']
    },
    {
      name: APP_CONFIG.SHEETS.PEI,
      headers: ['Código', 'Descripción', 'Nombre del indicador 1/', 'Logro Alcanzado 2025 2/', 'Medio de Verificación 3/']
    },
    {
      name: APP_CONFIG.SHEETS.VINCULACION,
      headers: ['area', 'codAei']
    }
  ];

  schema.forEach(shInfo => {
    let sh = ss.getSheetByName(shInfo.name);
    if (!sh) {
      sh = ss.insertSheet(shInfo.name);
      sh.appendRow(shInfo.headers);
      sh.getRange(1, 1, 1, shInfo.headers.length).setFontWeight('bold').setBackground('#f1f5f9');
      console.log(`Hoja creada: ${shInfo.name}`);
    } else {
      console.log(`La hoja ${shInfo.name} ya existe.`);
    }
  });

  return "Inicialización completa. Verifique su Spreadsheet.";
}
