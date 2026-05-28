function home_getDashboardData() {
  const session = Auth.getSession();
  if (!session) throw new Error("Sesión no válida");

  const modules = [
    { key: 'INDICADORES',      name: 'Indicadores' },
    { key: 'ACTIVIDADES',      name: 'Actividades' },
    { key: 'RIESGOS',          name: 'Riesgos' },
    { key: 'CAPACITACIONES',   name: 'Capacitaciones' }
  ];

  let allRecords = [];
  let moduleTotals = {};

  modules.forEach(mod => {
    try {
      const sheetName = APP_CONFIG.SHEETS[mod.key];
      if (!sheetName) return;

      const data = SheetService.readObjects(sheetName);
      moduleTotals[mod.key] = data.length;

      data.forEach(row => {
        allRecords.push({
          _module: mod.name,
          _date: serializeDate(row.fecha || row.fechaCreacion || row.fechaObjetivo),
          estado: String(row.estado || ''),
          area: String(row.area || ''),
          prioridad: String(row.prioridad || ''),
          modalidad: String(row.modalidad || ''),
          avance: Number(row.avance) || 0,
          codAei: String(row.codAei || row.codaei || '')
        });
      });
    } catch (e) {
      console.error('home_getDashboardData [' + mod.key + ']: ' + e.message);
    }
  });

  return {
    success: true,
    records: allRecords,
    moduleTotals: moduleTotals,
    total: allRecords.length
  };
}

function serializeDate(val) {
  if (!val) return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val.toISOString();
  }
  if (typeof val === 'string') {
    const parts = val.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (parts) {
      const d = new Date(Number(parts[3]), Number(parts[2]) - 1, Number(parts[1]));
      return isNaN(d.getTime()) ? null : d.toISOString();
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  return null;
}

function bannerhome_list() {
  try {
    const raw = SheetService.readObjects(APP_CONFIG.SHEETS.BANNER_HOME);
    return raw.map(r => ({
      titulo: String(r.titulo || r.title || '').trim(),
      url_imagen: String(r.url_imagen || r.url || r.imagen || '').trim(),
      descripcion: String(r.descripcion || r.description || r.desc || '').trim()
    })).filter(r => r.url_imagen !== '');
  } catch (e) {
    return [];
  }
}
