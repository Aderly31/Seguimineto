/**
 * Home_g.js
 * Dashboard de Inicio (Core v2)
 * 
 * IMPORTANTE: Solo enviamos al cliente los campos estrictamente
 * necesarios para el dashboard (ligero y sin objetos Date nativos).
 * 
 * Claves normalizadas que usa _normH_:
 *   fecha → Date, estado, ocurrencia, derivado_a,
 *   tipo_atencion, tipo_consulta, programa_interes,
 *   escuela_interes, filial_interes, filial, escuela, programa
 */

function home_getDashboardData() {
  const session = Auth.getSession();
  if (!session) throw new Error("Sesión no válida");

  const modules = [
    { key: 'ADMISION',             name: 'Admisión' },
    { key: 'PREGRADO',             name: 'Pregrado' },
    { key: 'POSGRADO',             name: 'Posgrado' },
    { key: 'SEGUNDA_ESPECIALIDAD', name: '2° Especialidad' },
    { key: 'SUGERENCIAS',          name: 'Sugerencias' },
    { key: 'EXTERNOS',             name: 'Externos' },
    { key: 'GENERAL',              name: 'General' }
  ];

  let allRecords = [];

  modules.forEach(mod => {
    try {
      const sheetName = APP_CONFIG.SHEETS[mod.key];
      if (!sheetName) return;

      const data = SheetService.readObjects(sheetName);
      console.log('[HOME] ' + mod.key + ': ' + data.length + ' registros de hoja "' + sheetName + '"');

      // ★ SOLO extraer campos necesarios para el dashboard
      // Esto evita enviar Date nativos y reduce el payload
      data.forEach(row => {
        allRecords.push({
          _module:  mod.name,
          _date:    _serializeDate_(row.fecha),
          estado:   String(row.estado || ''),
          ocu:      String(row.ocurrencia || ''),
          deriv:    String(row.derivado_a || ''),
          tipo_at:  String(row.tipo_atencion || ''),
          tipo_c:   String(row.tipo_consulta || row.programa_interes || ''),
          escuela:  String(row.escuela || row.escuela_interes || ''),
          filial:   String(row.filial || row.filial_interes || ''),
          programa: String(row.programa || row.programa_interes || '')
        });
      });

    } catch (e) {
      console.error('home_getDashboardData [' + mod.key + ']: ' + e.message);
    }
  });

  console.log('[HOME] Total registros para dashboard: ' + allRecords.length);

  return {
    success: true,
    records: allRecords,
    total: allRecords.length
  };
}

/**
 * Serializa una fecha a string ISO.
 * google.script.run NO puede transferir objetos Date nativos.
 */
function _serializeDate_(val) {
  if (!val) return null;

  // Caso 1: Date nativo de Google Sheets
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val.toISOString();
  }

  // Caso 2: String en formato dd/mm/yyyy (común en Perú)
  if (typeof val === 'string') {
    const parts = val.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (parts) {
      const d = new Date(Number(parts[3]), Number(parts[2]) - 1, Number(parts[1]));
      return isNaN(d.getTime()) ? null : d.toISOString();
    }
    // Intentar parsing normal
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  return null;
}

/**
 * Retorna banners desde la hoja banner_home
 * Solo devuelve campos seguros (strings), nunca Dates.
 */
function bannerhome_list() {
  try {
    const raw = SheetService.readObjects(APP_CONFIG.SHEETS.BANNER_HOME);
    return raw.map(r => ({
      titulo:      String(r.titulo      || r.title       || '').trim(),
      url_imagen:  String(r.url_imagen  || r.url         || r.imagen || '').trim(),
      descripcion: String(r.descripcion || r.description || r.desc   || '').trim()
    })).filter(r => r.url_imagen !== '');
  } catch (e) {
    return [];
  }
}
