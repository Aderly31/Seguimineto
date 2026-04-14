/***********************
 * 1) Config.gs
 * SOLO CONFIGURACIÓN (SIN doGet / include_)
 ***********************/
const APP_CONFIG = {
  // ✅ ID del Spreadsheet (puedes dejar el tuyo actual)
  SPREADSHEET_ID: '1OpRmcCY4BEN8KeJUPiF1N5Uzex7I3OrR0EJesqfZGo0',

  // ✅ Nombres de hojas core
  SHEETS: {
    USUARIOS: 'usuarios',
    PAGINAS: 'Paginas',
    INDICADORES: 'Indicadores',
    ACTIVIDADES: 'Actividades',
    RIESGOS: 'Riesgos',
    CAPACITACIONES: 'Capacitaciones',
    REVISIONES: 'Revisiones',
    AREAS: 'Areas',
    PEI: 'Pei',
    VINCULACION: 'Vinculacion'
  },

  // ✅ Branding
  APP_NAME: 'Recolecion de Informacion',
  LOGO_URL: 'https://i.postimg.cc/RVgcXF3f/logo_uac_blanco.png',          // <-- cambia si deseas

  LOGIN_BG_URL: 'https://i.postimg.cc/t4RzjJzc/UAC-frontis.jpg',    // <-- cambia si deseas

  // ✅ Dominio permitido
  ALLOWED_DOMAIN: 'uandina.edu.pe'
};