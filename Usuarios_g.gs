/**
 * =========================
 * Usuarios_g.gs (MÓDULO)
 * Prefijo: usuarios_*
 * Hoja: usuarios
 * Columnas: email, name, nombre, apellido, estado, rol
 * Roles edit/ver: admin
 * =========================
 */

const USUARIOS_MODULE = (() => {
  const USERS_SHEET = APP_CONFIG.SHEETS.USUARIOS || 'usuarios';
  const ROLES_SHEET = APP_CONFIG.SHEETS.ROLES || 'Roles';
  const ADMIN_ROLES = ['admin'];

  function requireSession_() {
    const session = Auth.getSession(); // requerido
    if (!session) throw new Error('Sesión inválida.');
    return session;
  }

  function requireAdmin_(session) {
    const role = String(session.rol || '').toLowerCase().trim();
    if (!ADMIN_ROLES.includes(role)) throw new Error('No tienes permisos para realizar esta acción.');
  }

  function ss_() {
    return SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID);
  }

  function shUsers_() {
    const sh = ss_().getSheetByName(USERS_SHEET);
    if (!sh) throw new Error(`No existe la hoja: ${USERS_SHEET}`);
    return sh;
  }

  function shRoles_() {
    const sh = ss_().getSheetByName(ROLES_SHEET);
    if (!sh) throw new Error(`No existe la hoja: ${ROLES_SHEET}`);
    return sh;
  }

  function norm_(v) { return String(v ?? '').trim(); }
  function normLower_(v) { return norm_(v).toLowerCase(); }

  function truthy_(v) {
    if (typeof v === 'boolean') return v === true;
    if (typeof v === 'number') return v !== 0;
    const s = normLower_(v);
    return ['1', 'true', 'si', 'sí', 'yes', 'activo', 'activa', 'ok'].includes(s);
  }

  function getHeaders_() {
    const sh = shUsers_();
    const lastCol = sh.getLastColumn();
    if (lastCol < 1) throw new Error('La hoja usuarios no tiene encabezados.');
    const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(h => norm_(h));
    return headers;
  }

  function headerIndex_(headers) {
    const map = {};
    headers.forEach((h, i) => map[h] = i);
    return map;
  }

  function ensureHeaders_() {
    const headers = getHeaders_();
    const required = ['email','name','nombre','apellido','estado','rol'];
    const missing = required.filter(r => !headers.includes(r));
    if (missing.length) throw new Error(`Faltan columnas en "${USERS_SHEET}": ${missing.join(', ')}`);
    return headers;
  }

  function readAll_() {
    const sh = shUsers_();
    const lastRow = sh.getLastRow();
    const lastCol = sh.getLastColumn();
    const headers = ensureHeaders_();
    const idx = headerIndex_(headers);

    if (lastRow < 2) return [];

    const values = sh.getRange(2, 1, lastRow - 1, lastCol).getValues();

    return values
      .map((r, i) => ({ r, rowNumber: i + 2 }))
      .filter(x => x.r.some(c => norm_(c) !== ''))
      .map(x => {
        const r = x.r;
        return {
          _row: x.rowNumber,
          email: normLower_(r[idx.email]),
          name: norm_(r[idx.name]),
          nombre: norm_(r[idx.nombre]),
          apellido: norm_(r[idx.apellido]),
          estado: r[idx.estado],
          rol: normLower_(r[idx.rol]),
          activo: truthy_(r[idx.estado])
        };
      });
  }

  function findByEmail_(emailLower) {
    const all = readAll_();
    return all.find(u => u.email === emailLower) || null;
  }

  function validatePayload_(obj) {
    const email = normLower_(obj?.email);
    if (!email) throw new Error('El email es obligatorio.');
    if (!email.includes('@')) throw new Error('Email inválido.');

    const rol = normLower_(obj?.rol);
    if (!rol) throw new Error('El rol es obligatorio.');

    // estado: si no viene, default TRUE
    let estado = obj?.estado;
    if (estado === undefined || estado === null || norm_(estado) === '') estado = true;

    return {
      email,
      name: norm_(obj?.name),
      nombre: norm_(obj?.nombre),
      apellido: norm_(obj?.apellido),
      estado: (typeof estado === 'boolean') ? estado : norm_(estado),
      rol
    };
  }

  function writeRow_(rowNumber, obj) {
    const sh = shUsers_();
    const headers = ensureHeaders_();
    const idx = headerIndex_(headers);
    const row = new Array(headers.length).fill('');

    row[idx.email] = obj.email;
    row[idx.name] = obj.name;
    row[idx.nombre] = obj.nombre;
    row[idx.apellido] = obj.apellido;
    row[idx.estado] = obj.estado; // boolean o string
    row[idx.rol] = obj.rol;

    sh.getRange(rowNumber, 1, 1, headers.length).setValues([row]);
  }

  function appendRow_(obj) {
    const sh = shUsers_();
    const headers = ensureHeaders_();
    const idx = headerIndex_(headers);
    const row = new Array(headers.length).fill('');

    row[idx.email] = obj.email;
    row[idx.name] = obj.name;
    row[idx.nombre] = obj.nombre;
    row[idx.apellido] = obj.apellido;
    row[idx.estado] = obj.estado;
    row[idx.rol] = obj.rol;

    sh.appendRow(row);
  }

  // ======= API (usuarios_*) =======

  function usuarios_listar() {
    const session = requireSession_();
    if (normLower_(session.rol) !== 'admin') throw new Error('No tienes permisos para ver usuarios.');

    const rows = readAll_();
    rows.sort((a,b) => a.email.localeCompare(b.email));

    return rows.map(u => ({
      email: u.email,
      name: u.name,
      nombre: u.nombre,
      apellido: u.apellido,
      estado: u.estado,
      activo: u.activo,
      rol: u.rol
    }));
  }

  function usuarios_get(email) {
    const session = requireSession_();
    if (normLower_(session.rol) !== 'admin') throw new Error('No tienes permisos para ver usuarios.');

    const e = normLower_(email);
    if (!e) throw new Error('Email requerido.');
    const u = findByEmail_(e);
    if (!u) return null;

    return {
      email: u.email,
      name: u.name,
      nombre: u.nombre,
      apellido: u.apellido,
      estado: u.estado,
      activo: u.activo,
      rol: u.rol
    };
  }

  function usuarios_save(userObj) {
    const session = requireSession_();
    requireAdmin_(session);

    const u = validatePayload_(Object.assign({}, userObj));

    const existing = findByEmail_(u.email);
    if (existing) {
      writeRow_(existing._row, u);
      return { ok: true, action: 'updated', email: u.email };
    }
    appendRow_(u);
    return { ok: true, action: 'created', email: u.email };
  }

  function usuarios_delete(email) {
    const session = requireSession_();
    requireAdmin_(session);

    const e = normLower_(email);
    if (!e) throw new Error('Email requerido.');

    const existing = findByEmail_(e);
    if (!existing) throw new Error('No existe el usuario.');

    shUsers_().deleteRow(existing._row);
    return { ok: true, email: e };
  }

  function usuarios_roles_listar() {
    const session = requireSession_();
    requireAdmin_(session);

    const sh = shRoles_();
    const lastRow = sh.getLastRow();
    if (lastRow < 2) return [];

    const values = sh.getRange(2, 1, lastRow - 1, 1).getValues();
    const roles = values
      .map(r => normLower_(r[0]))
      .filter(Boolean);

    // eliminar duplicados
    return Array.from(new Set(roles)).sort();
  }

  return {
    usuarios_listar,
    usuarios_get,
    usuarios_save,
    usuarios_delete,
    usuarios_roles_listar
  };
})();

/** ===== Export global functions ===== */
function usuarios_listar(){ return USUARIOS_MODULE.usuarios_listar(); }
function usuarios_get(email){ return USUARIOS_MODULE.usuarios_get(email); }
function usuarios_save(userObj){ return USUARIOS_MODULE.usuarios_save(userObj); }
function usuarios_delete(email){ return USUARIOS_MODULE.usuarios_delete(email); }
function usuarios_roles_listar(){ return USUARIOS_MODULE.usuarios_roles_listar(); }
