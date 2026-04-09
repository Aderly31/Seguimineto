/***********************
 * 2) Code.gs
 * ÚNICO doGet + include_
 ***********************/
function doGet(e) {
  const appUrl = ScriptApp.getService().getUrl();
  const page = String(e?.parameter?.page || '').toLowerCase().trim();

  // ===== Login =====
  if (!page || page === 'login') {
    const t = HtmlService.createTemplateFromFile('Login');
    t.appName = APP_CONFIG.APP_NAME;
    t.appUrl = appUrl;
    t.logoUrl = APP_CONFIG.LOGO_URL;
    t.loginBgUrl = APP_CONFIG.LOGIN_BG_URL;

    return t.evaluate()
      .setTitle('Login - ' + APP_CONFIG.APP_NAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // ===== Validar sesión =====
  let session;
  try {
    session = Auth.getSession();
  } catch (err) {
    const t = HtmlService.createTemplateFromFile('NoAutorizado');
    t.appName = APP_CONFIG.APP_NAME;
    t.logoUrl = APP_CONFIG.LOGO_URL;
    t.loginBgUrl = APP_CONFIG.LOGIN_BG_URL;
    t.appUrl = appUrl;
    t.message = err?.message || String(err);

    return t.evaluate()
      .setTitle('Acceso restringido - ' + APP_CONFIG.APP_NAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // ===== Rutas + Menú por rol =====
  const data = SheetService.getRoutesForRole(session.rol);
  const routes = data.routes || {};
  const menuTree = data.menuTree || [];

  // ===== Resolver página =====
  const route = routes[page] || routes['404'] || { title: 'No encontrado', view: 'NotFound', menu: false };
  const view = route.view || 'NotFound'; // ✅ evita include_ vacío

  const t = HtmlService.createTemplateFromFile('Main');
  t.appName = APP_CONFIG.APP_NAME;
  t.appUrl = appUrl;
  t.logoUrl = APP_CONFIG.LOGO_URL;

  t.session = session;
  t.routes = routes;
  t.menuTree = menuTree;

  t.currentPage = page;
  t.view = view;

  return t.evaluate()
    .setTitle(APP_CONFIG.APP_NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include_(file) {
  return HtmlService.createHtmlOutputFromFile(file).getContent();
}