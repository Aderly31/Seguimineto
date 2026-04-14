/**
 * Common_g.gs
 * Funciones compartidas para carga de datos globales (Areas, PEI, Vinculación).
 * Integra lógica inteligente de búsqueda de columnas.
 */

const Common = (() => {
  
  /**
   * Helper para encontrar valores en objetos por nombre de columna aproximado.
   */
  const getVal = (obj, search) => {
    const key = Object.keys(obj).find(k => k.toLowerCase().includes(search.toLowerCase()));
    return key ? obj[key] : '';
  };

  /**
   * Obtiene la lista jerárquica de áreas.
   */
  function getAreas() {
    const data = SheetService.readObjects_(APP_CONFIG.SHEETS.AREAS);
    return data.map(a => {
      const unidad = getVal(a, 'dependencia') || getVal(a, 'unidad');
      const subunidad = getVal(a, 'subunidad') || getVal(a, 'area');
      const label = subunidad ? `${unidad} - ${subunidad}` : unidad;
      const id = subunidad || unidad; 
      
      return { 
        id: String(id).trim(), 
        label: String(label).trim() 
      };
    }).filter(a => a.id !== '');
  }

  /**
   * Obtiene la lista de objetivos y acciones PEI.
   */
  function getPEI() {
    const data = SheetService.readObjects_(APP_CONFIG.SHEETS.PEI);
    return data.map(p => ({
      codAei: String(getVal(p, 'cód') || getVal(p, 'cod')).trim(),
      accion: String(getVal(p, 'descrip')).trim(),
      indicador: String(getVal(p, 'indicador')).trim()
    })).filter(p => p.codAei !== '');
  }

  /**
   * Obtiene las vinculaciones guardadas.
   */
  function getVinculaciones() {
    const sheetName = APP_CONFIG.SHEETS.VINCULACION || 'Vinculacion';
    try {
      const data = SheetService.readObjects_(sheetName);
      return data.map(v => ({
        areaId: String(getVal(v, 'area')).toLowerCase().trim(),
        aeiCode: String(getVal(v, 'aei') || getVal(v, 'cod')).toLowerCase().trim()
      }));
    } catch(e) {
      return [];
    }
  }

  /**
   * Obtiene las acciones PEI vinculadas a un área específica para los formularios.
   */
  function getVinculacionByArea(areaId) {
    if (!areaId) return [];
    
    const vinculaciones = getVinculaciones();
    const areaTarget = String(areaId).toLowerCase().trim();
    const matchedCodes = vinculaciones
      .filter(v => v.areaId === areaTarget)
      .map(v => v.aeiCode);
    
    const pei = getPEI();
    return pei.filter(p => matchedCodes.includes(String(p.codAei).toLowerCase().trim()));
  }

  return { getAreas, getPEI, getVinculaciones, getVinculacionByArea };
})();

// Wrappers para google.script.run
function common_getAreas() { return Common.getAreas(); }
function common_getPEI() { return Common.getPEI(); }
function common_getVinculacion(areaId) { return Common.getVinculacionByArea(areaId); }
function common_getAppData() {
  return {
    areas: Common.getAreas(),
    pei: Common.getPEI(),
    vinculaciones: Common.getVinculaciones()
  };
}
