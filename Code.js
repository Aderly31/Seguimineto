/**
 * ===============================================================
 * NÚCLEO DEL SERVIDOR (Core v2)
 * ===============================================================
 */

function doGet(e) {
  const page = String(e?.parameter?.page || '').toLowerCase().trim();

  // 1. Ruta de Login explícita
  if (page === 'login') {
    const t = HtmlService.createTemplateFromFile('Login');
    t.config = APP_CONFIG;
    return t.evaluate()
      .setTitle('Login - ' + APP_CONFIG.NAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // 2. Validación de Sesión (Gatekeeper)
  const session = Auth.getSession();
  
  if (!session) {
    const t = HtmlService.createTemplateFromFile('Login');
    t.config = APP_CONFIG;
    return t.evaluate()
      .setTitle('Autenticación Requerida - ' + APP_CONFIG.NAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // 3. Carga de Aplicación Principal
  const template = HtmlService.createTemplateFromFile('Main');
  template.config = APP_CONFIG;
  template.session = session;
  
  return template.evaluate()
    .setTitle(APP_CONFIG.NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Función de inclusión de archivos HTML
 */
function include(filename) {
  try {
    const template = HtmlService.createTemplateFromFile(filename);
    template.config = APP_CONFIG;
    try { template.session = Auth.getSession(); } catch(e){}
    return template.evaluate().getContent();
  } catch (e) {
    return `<!-- Error al incluir ${filename}: ${e.message} -->`;
  }
}

function include_(filename) { return include(filename); }

/**
 * Motor de carga de módulos SPA (Optimizado con Caché de Sesión)
 */
function getPageData(pageKey) {
  const cache = CacheService.getUserCache();
  const cacheKey = 'PAGE_HTML_' + pageKey.toLowerCase();

  try {
    const cachedHtml = cache.get(cacheKey);
    if (cachedHtml) {
      return { success: true, html: cachedHtml, title: "Cargado desde caché", cached: true };
    }

    const session = Auth.getSession();
    if (!session) throw new Error("Sesión expirada");

    const filename = pageKey.charAt(0).toUpperCase() + pageKey.slice(1);
    const html = include(filename);
    
    const { routes } = SheetService.getRoutesForRole(session.rol);
    const title = (routes[pageKey.toLowerCase()] ? routes[pageKey.toLowerCase()].title : filename);

    const result = { success: true, html: html, title: title };
    cache.put(cacheKey, html, 600);
    return result;
  } catch (e) {
    return { success: false, message: e.message };
  }
}

/**
 * SISTEMA DE PERMISOS DINÁMICO (Optimizado con Caché de Servidor)
 */
function getAppPermissions() {
  const cache = CacheService.getUserCache();
  const cacheKey = 'USER_PERMS_' + Session.getActiveUser().getEmail();
  
  try {
    const cached = cache.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const session = Auth.getSession();
    if (!session) return { access: false, message: "Sesión no válida" };

    const userEmail = session.email;
    const user = SheetService.findUserByEmail(userEmail);

    if (!user || !user.isActive) {
      return { access: false, email: userEmail };
    }

    const { routes, menuTree } = SheetService.getRoutesForRole(user.rol);

    const result = {
      access: true,
      userName: user.nombre || user.name,
      userRole: user.rol,
      email: userEmail,
      menu: menuTree,
      routes: routes 
    };

    cache.put(cacheKey, JSON.stringify(result), 900);
    return result;
  } catch (e) {
    return { access: false, error: e.message };
  }
}

/**
 * FUNCIONES COMPARTIDAS (HELPERS UNIFICADOS)
 */
function getSS() {
  return SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID);
}
