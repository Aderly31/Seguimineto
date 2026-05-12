/**
 * Home_g.gs
 * Hoja: banner_home
 * Columnas (flexibles): titulo, url_imagen, descripcion
 * Prefijo: bannerhome_*
 */

function bannerhome_list() {
  const session = Auth.getSession(); // ✅ seguridad obligatoria

  const ss = SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID);
  const sh = ss.getSheetByName('banner_home');
  if (!sh) throw new Error('No existe la hoja: banner_home');

  const values = sh.getDataRange().getValues();
  if (!values || values.length < 2) return [];

  const rawHeaders = values[0].map(h => String(h ?? '').trim());
  const headers = rawHeaders.map(h => _bh_normHeader_(h));

  const idxTitle = _bh_findHeaderIndex_(headers, ['titulo', 'title', 'título']);
  const idxUrl   = _bh_findHeaderIndex_(headers, ['url_imagen', 'urlimagen', 'url', 'imagen', 'image', 'url_imagen_banner', 'url imagen', 'url-imagen']);
  const idxDesc  = _bh_findHeaderIndex_(headers, ['descripcion', 'descripción', 'desc', 'detalle', 'descripcion_imagen', 'descripcion banner', 'description']);

  if (idxUrl === -1 || idxDesc === -1) {
    // titulo es opcional; url y descripcion son obligatorios para el render
    throw new Error(
      'Encabezados inválidos. Se requiere URL y descripción. ' +
      'Ejemplo recomendado: titulo, url_imagen, descripcion'
    );
  }

  return values.slice(1)
    .map(r => ({
      titulo: idxTitle === -1 ? '' : String(r[idxTitle] ?? '').trim(),
      url_imagen: String(r[idxUrl] ?? '').trim(),
      descripcion: String(r[idxDesc] ?? '').trim()
    }))
    .filter(x => String(x.url_imagen || '').trim() !== '');
}

/** Normaliza encabezados: baja a minúsculas, quita tildes, espacios y símbolos */
function _bh_normHeader_(h) {
  return String(h || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^a-z0-9]+/g, '_')                      // todo a underscores
    .replace(/^_+|_+$/g, '');                         // trim underscores
}

/** Busca índice por alias normalizados */
function _bh_findHeaderIndex_(headersNorm, aliases) {
  const aliasNorm = (aliases || []).map(a => _bh_normHeader_(a));
  for (let i = 0; i < headersNorm.length; i++) {
    if (aliasNorm.includes(headersNorm[i])) return i;
  }
  return -1;
}
