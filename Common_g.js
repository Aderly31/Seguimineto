/**
 * Common_g.gs
 * Funciones compartidas para carga de datos globales (Areas, PEI, Vinculación).
 */

const Common = (() => {
  
  /**
   * Obtiene la lista jerárquica de áreas.
   */
  function getAreas() {
    const data = SheetService.readObjects_(APP_CONFIG.SHEETS.AREAS);
    return data.map(it => ({
      id: String(it.area || ''),
      label: `[${it.area}] ${it.descripcion}`,
      parent: String(it.dependencia || '')
    }));
  }

  /**
   * Obtiene la lista de objetivos y acciones PEI.
   */
  function getPEI() {
    return SheetService.readObjects_(APP_CONFIG.SHEETS.PEI).map(it => ({
      codAei: String(it['Código'] || ''),
      accion: String(it['Descripción'] || ''),
      indicador: String(it['Nombre del indicador 1/'] || '')
    }));
  }

  /**
   * Obtiene las acciones PEI vinculadas a un área específica.
   */
  function getVinculacionByArea(areaId) {
    if (!areaId) return [];
    
    const v = SheetService.readObjects_(APP_CONFIG.SHEETS.VINCULACION);
    const filter = v.filter(it => String(it.area).toLowerCase() === String(areaId).toLowerCase());
    const matchedCodes = filter.map(it => String(it.codaei).toLowerCase());
    
    // Cruza con el maestro de PEI
    const pei = getPEI();
    return pei.filter(it => matchedCodes.includes(String(it.codAei).toLowerCase()));
  }

  return { getAreas, getPEI, getVinculacionByArea };
})();

// Wrappers para google.script.run
function common_getAreas() { return Common.getAreas(); }
function common_getPEI() { return Common.getPEI(); }
function common_getVinculacion(areaId) { return Common.getVinculacionByArea(areaId); }
function common_getAppData() {
  return {
    areas: Common.getAreas(),
    pei: Common.getPEI()
  };
}
