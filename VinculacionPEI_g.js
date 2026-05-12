/**
 * VinculacionPEI_g.gs
 * Lógica para el módulo de vinculación entre Áreas y PEI.
 */

function vinculacion_getData() {
  try {
    // Función inteligente para encontrar columnas sin importar espacios, guiones o símbolos ("1/")
    const getVal = (obj, search) => {
      const key = Object.keys(obj).find(k => k.toLowerCase().includes(search.toLowerCase()));
      return key ? obj[key] : '';
    };

    // 1. OBTENER ÁREAS
    let areas =[];
    try {
      // Intenta leer la hoja llamada 'Areas' (o el nombre que uses)
      const shAreas = SheetService.readObjects_('Areas'); 
      areas = shAreas.map(a => {
        // Busca las columnas: 'unidad-dependencia' y 'subunidad-area'
        const unidad = getVal(a, 'dependencia') || getVal(a, 'unidad');
        const subunidad = getVal(a, 'subunidad') || getVal(a, 'area');
        
        // Si hay subunidad, la mostramos junto a la unidad para mayor claridad
        const label = subunidad ? `${unidad} - ${subunidad}` : unidad;
        
        // Usaremos el nombre de la subunidad (o unidad) como identificador único
        const id = subunidad || unidad; 
        
        return { 
          id: String(id).trim(), 
          label: String(label).trim() 
        };
      }).filter(a => a.id !== ''); // Filtra filas vacías
    } catch(e) {
      throw new Error("No se pudo leer la hoja 'Areas'. Verifica que exista.");
    }

    // 2. OBTENER PEI
    let pei =[];
    try {
      const shPEI = SheetService.readObjects_('PEI');
      pei = shPEI.map(p => {
        // Busca las columnas: 'Código', 'Descripción', 'Nombre del indicador 1/'
        return {
          codAei: String(getVal(p, 'cód') || getVal(p, 'cod')).trim(),
          accion: String(getVal(p, 'descrip')).trim(),
          indicador: String(getVal(p, 'indicador')).trim()
        };
      }).filter(p => p.codAei !== '');
    } catch(e) {
      throw new Error("No se pudo leer la hoja 'PEI'. Verifica que exista.");
    }

    // 3. OBTENER VINCULACIONES GUARDADAS
    let vinculaciones =[];
    const sheetName = APP_CONFIG.SHEETS.VINCULACION || 'Vinculacion';
    try {
      const rawVinc = SheetService.readObjects_(sheetName);
      vinculaciones = rawVinc.map(v => ({
        areaId: String(getVal(v, 'area')).toLowerCase().trim(),
        aeiCode: String(getVal(v, 'aei') || getVal(v, 'cod')).toLowerCase().trim()
      }));
    } catch(e) {
      // Si es la primera vez y la hoja no existe, no hay problema.
    }

    return { areas, pei, vinculaciones };

  } catch(err) {
    throw new Error("Error crítico obteniendo datos: " + err.message);
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