/**
 * VinculacionPEI_g.gs
 * Lógica para el módulo de vinculación entre Áreas y PEI.
 * Utiliza Common_g.gs para la obtención de datos maestros.
 */

function vinculacion_getData() {
  try {
    return Common.getAppData();
  } catch(err) {
    throw new Error("Error obteniendo datos para vinculación: " + err.message);
  }
}

/**
 * Guarda la vinculación para un área en específico.
 */
function vinculacion_save(areaId, aeiCodes) {
  try {
    const sheetName = APP_CONFIG.SHEETS.VINCULACION || 'Vinculacion';
    const ss = SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID);
    let sh = ss.getSheetByName(sheetName);
    
    // Crear hoja si no existe
    if (!sh) {
      sh = ss.insertSheet(sheetName);
      sh.appendRow(['Area_ID', 'AEI_Code']);
      sh.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#f1f5f9');
    }

    const data = sh.getDataRange().getValues();
    const areaTarget = String(areaId).toLowerCase().trim();
    
    // Eliminar vínculos existentes para el área seleccionada
    // Empezamos desde el final para no mover índices
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).toLowerCase().trim() === areaTarget) {
        sh.deleteRow(i + 1);
      }
    }
    
    // Insertar los nuevos códigos checkeados
    if (aeiCodes && aeiCodes.length > 0) {
      aeiCodes.forEach(code => {
        sh.appendRow([areaId, code]);
      });
    }
    
    return { success: true, message: 'La vinculación se guardó con éxito.' };
  } catch (e) {
    return { success: false, message: String(e) };
  }
}