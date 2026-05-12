/***********************
 * 3) SheetService.gs
 * ÚNICA definición (NO duplicar este archivo)
 ***********************/
const SheetService = (() => {
  function ss_() { return SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID); }

  function sh_(name) {
    const sh = ss_().getSheetByName(name);
    if (!sh) throw new Error(`No existe la hoja: ${name}`);
    return sh;
  }

  function norm_(v) { return String(v ?? '').trim(); }
  function normLower_(v) { return norm_(v).toLowerCase(); }

  function isTruthy_(v) {
    if (typeof v === 'boolean') return v === true;
    if (typeof v === 'number') return v !== 0;
    const s = normLower_(v);
    return ['1','true','si','sí','yes','activo','activa','ok'].includes(s);
  }

  function splitCsv_(v) {
    return norm_(v).split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  }

  function readObjects_(sheetName) {
    const sh = sh_(sheetName);
    const values = sh.getDataRange().getValues();
    if (!values || values.length < 2) return [];

    const headers = values[0].map(h => norm_(h));
    return values.slice(1)
      .filter(row => row.some(c => norm_(c) !== ''))
      .map(row => {
        const obj = {};
        headers.forEach((h, i) => obj[h] = row[i]);
        return obj;
      });
  }

  // ===== Usuarios =====
  function getAllUsers() {
    const rows = readObjects_(APP_CONFIG.SHEETS.USUARIOS);
    return rows.map(r => ({
      email: normLower_(r.email),
      name: norm_(r.name),
      nombre: norm_(r.nombre),
      apellido: norm_(r.apellido),
      estado: r.estado,
      activo: isTruthy_(r.estado),
      rol: normLower_(r.rol)
    }));
  }

  function findUserByEmail(email) {
    const e = normLower_(email);
    if (!e) return null;
    const users = getAllUsers();
    const u = users.find(x => x.email === e);
    if (!u) return null;

    return {
      email: u.email,
      name: u.name,
      nombre: u.nombre,
      apellido: u.apellido,
      estado: u.estado,
      isActive: u.activo,
      rol: u.rol
    };
  }

  // ===== Páginas =====
  function getAllPages() {
    const rows = readObjects_(APP_CONFIG.SHEETS.PAGINAS);
    return rows.map(r => ({
      titulo: norm_(r.titulo),
      url: norm_(r.url),
      urlKey: normLower_(r.url),
      activo: isTruthy_(r.activo),
      roles: splitCsv_(r.rol),
      padre: norm_(r.padre || ''),
      padreKey: normLower_(r.padre || ''),
      icono: normLower_(r.icono || '')
    })).filter(p => p.urlKey);
  }

  function pageKeyToView_(pageKey) {
    const key = norm_(pageKey);
    if (!key) return 'Home';
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  function getRoutesForRole(userRole) {
    const role = normLower_(userRole || 'invitado');
    const pages = getAllPages();

    // Si rol está vacío en la hoja, consideramos visible para todos
    const visible = pages.filter(p => {
      if (!p.activo) return false;
      if (!p.roles || p.roles.length === 0) return true; // ✅ mejora
      return p.roles.includes('*') || p.roles.includes('all') || p.roles.includes(role);
    });

    // routes para doGet
    const routes = {};
    visible.forEach(p => {
      routes[p.urlKey] = {
        title: p.titulo || p.url,
        view: pageKeyToView_(p.url),
        menu: true,
        parentKey: p.padreKey || ''
      };
    });

    // Home siempre (aunque no exista en Paginas)
    if (!routes.home) routes.home = { title: 'Inicio', view: 'Home', menu: true, parentKey: '' };

    // 404
    routes['404'] = { title: 'No encontrado', view: 'NotFound', menu: false, parentKey: '' };

    // ===== Árbol menú (acordeón) =====
    const childrenByParent = new Map();
    visible.forEach(p => {
      const pk = p.padreKey || '';
      if (!pk) return;
      if (!childrenByParent.has(pk)) childrenByParent.set(pk, []);
      childrenByParent.get(pk).push(p);
    });

    function sortByTitle_(a, b) {
      return String(a.titulo || '').localeCompare(String(b.titulo || ''), 'es', { sensitivity:'base' });
    }

    // nodos top-level
    const top = visible.filter(p => !p.padreKey).sort(sortByTitle_);

    const menuTree = [];
    menuTree.push({
      key: 'home',
      urlKey: 'home',
      title: routes.home.title,
      view: routes.home.view,
      children: []
    });

    top.forEach(p => {
      if (p.urlKey === 'home') return;
      const kids = (childrenByParent.get(p.urlKey) || []).sort(sortByTitle_);
      menuTree.push({
        key: p.urlKey,
        urlKey: p.urlKey,
        title: p.titulo || p.url,
        view: kids.length ? '' : pageKeyToView_(p.url),
        icon: p.icono || (kids.length ? 'fa-folder' : 'fa-circle-dot'),
        children: kids.map(k => ({
          key: k.urlKey,
          urlKey: k.urlKey,
          title: k.titulo || k.url,
          view: pageKeyToView_(k.url),
          icon: k.icono || 'fa-file-lines'
        }))
      });
    });

    // padres implícitos
    const implicit = [];
    childrenByParent.forEach((kids, pk) => {
      if (pk === 'home') return;
      if (menuTree.some(n => n.key === pk)) return;

      implicit.push({
        key: pk,
        urlKey: pk,
        title: (kids[0]?.padre) || pk,
        view: '',
        icon: 'fa-folder',
        children: kids.sort(sortByTitle_).map(k => ({
          key: k.urlKey,
          urlKey: k.urlKey,
          title: k.titulo || k.url,
          view: pageKeyToView_(k.url),
          icon: k.icono || 'fa-file-lines'
        }))
      });
    });

    implicit.sort((a,b)=>String(a.title).localeCompare(String(b.title),'es',{sensitivity:'base'}));
    menuTree.push(...implicit);

    return { routes, menuTree };
  }

  function saveObject_(sheetName, obj) {
    const sh = sh_(sheetName);
    const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(h => norm_(h));
    const row = headers.map(h => obj[h] ?? '');
    sh.appendRow(row);
    return true;
  }

  function updateObject_(sheetName, keyName, keyValue, newObj) {
    const sh = sh_(sheetName);
    const data = sh.getDataRange().getValues();
    if (data.length < 2) return false;
    const headers = data[0].map(h => norm_(h));
    const keyIdx = headers.indexOf(norm_(keyName));
    if (keyIdx === -1) return false;

    for (let i = 1; i < data.length; i++) {
      if (norm_(data[i][keyIdx]) === norm_(keyValue)) {
        const row = headers.map(h => newObj[h] ?? data[i][headers.indexOf(h)]);
        sh.getRange(i + 1, 1, 1, headers.length).setValues([row]);
        return true;
      }
    }
    return false;
  }

  function updateObjectById_(sheetName, id, newObj) {
    return updateObject_(sheetName, 'id', id, newObj);
  }

  return {
    // base
    readObjects_,
    saveObject_,
    updateObject_,
    updateObjectById_,
    
    // usuarios
    getAllUsers,
    findUserByEmail,

    // paginas
    getAllPages,
    getRoutesForRole
  };
})();