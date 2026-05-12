/** =========================
 * Auth.js (SSO institucional - Core v2)
 * =========================
 */

const Auth = (() => {
  const KEY = 'CORE_V2_SESSION'; 

  function getCurrentUserEmail_() {
    return String(Session.getActiveUser().getEmail() || '').toLowerCase().trim();
  }

  function validateAndBuildSession_() {
    const email = getCurrentUserEmail_();
    if (!email) throw new Error('No se pudo detectar tu cuenta de Google.');

    // 1. Validar dominio si está configurado
    if (APP_CONFIG.DOMAIN) {
      const domain = (email.split('@')[1] || '').toLowerCase();
      if (domain !== APP_CONFIG.DOMAIN.toLowerCase()) {
        throw new Error('Acceso restringido. Usa tu cuenta institucional (' + APP_CONFIG.DOMAIN + ').');
      }
    }

    // 2. Buscar usuario mediante el servicio centralizado
    const user = SheetService.findUserByEmail(email);
    if (!user) throw new Error('No estás registrado en el sistema. Contacta al administrador.');
    
    if (!user.isActive) {
        throw new Error('Tu usuario está inactivo o deshabilitado.');
    }

    return {
      email: email,
      name: user.nombre || user.name || email,
      rol: user.rol || 'invitado',
      ts: Date.now()
    };
  }

  function loginSSO() {
    const session = validateAndBuildSession_();
    // Guardamos el timestamp de inicio de sesión
    PropertiesService.getUserProperties().setProperty(KEY, String(Date.now()));
    return session;
  }

  let executionCache_ = null;

  function getSession() {
    // Si ya se validó en esta misma ejecución (petición), devolver el objeto cacheado
    if (executionCache_) return executionCache_;

    try {
      // 1. Verificar si existe el token de sesión
      const token = PropertiesService.getUserProperties().getProperty(KEY);
      if (!token) return null;

      // 2. Validar expiración (Ej: 4 horas = 14400000 ms)
      const lastLogin = parseInt(token);
      const now = Date.now();
      const sessionTimeout = 4 * 60 * 60 * 1000; 

      if (now - lastLogin > sessionTimeout) {
        logout(); // Limpiar sesión expirada
        return null;
      }

      // 3. Si existe y es reciente, validar que el usuario siga activo en la DB
      executionCache_ = validateAndBuildSession_();
      return executionCache_;
    } catch (e) {
      return null;
    }
  }

  function logout() {
    PropertiesService.getUserProperties().deleteProperty(KEY);
    return { ok: true };
  }

  return { loginSSO, getSession, logout };
})();

// Wrappers para llamadas desde el cliente
function auth_login_sso() { return Auth.loginSSO(); }
function auth_get_session() { return Auth.getSession(); }
function auth_logout() { return Auth.logout(); }
