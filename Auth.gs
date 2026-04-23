/** =========================
 * Auth.gs (SSO institucional)
 * =========================
 * Requiere que el deployment esté en:
 * Execute as: User accessing the web app
 */

const Auth = (() => {
  const KEY = 'UTD_UAC_SESSION'; // por si quieres guardar flags, es por usuario (execute as user)

  function getCurrentUserEmail_() {
    const email = String(Session.getActiveUser().getEmail() || '').toLowerCase().trim();
    return email;
  }

  function validateAndBuildSession_() {
    const email = getCurrentUserEmail_();
    if (!email) throw new Error('No se pudo obtener tu correo institucional. Ingresa con tu cuenta uandina.');

    if (APP_CONFIG.ALLOWED_DOMAIN) {
      const domain = (email.split('@')[1] || '').toLowerCase();
      if (domain !== APP_CONFIG.ALLOWED_DOMAIN.toLowerCase()) {
        throw new Error('Dominio no permitido.');
      }
    }

    const user = SheetService.findUserByEmail(email);
    if (!user) throw new Error('No estás registrado. Debes contactarte con el administrador.');
    if (!user.isActive) throw new Error('Tu usuario está inactivo. Contacta al administrador.');

    const fullName =
      (user.nombre || user.name || '') + (user.apellido ? (' ' + user.apellido) : '');

    return {
      email: user.email,
      name: fullName.trim() || user.email,
      rol: user.rol || 'invitado',
      area: user.area || '',
      ts: Date.now()
    };
  }

  // login “lógico” (solo valida y devuelve sesión)
  function loginSSO() {
    const session = validateAndBuildSession_();
    // opcional: marcar algo en user properties
    PropertiesService.getUserProperties().setProperty(KEY, String(Date.now()));
    return session;
  }

  // obtener sesión actual (siempre se recalcula)
  function getSession() {
    return validateAndBuildSession_();
  }

  // logout del sistema (no cierra Google)
  function logout() {
    PropertiesService.getUserProperties().deleteProperty(KEY);
    return { ok: true };
  }

  return { loginSSO, getSession, logout };
})();

function auth_login_sso() { return Auth.loginSSO(); }
function auth_get_session() { return Auth.getSession(); }
function auth_logout() { return Auth.logout(); }
