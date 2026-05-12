/**
 * ===============================================================
 * CONFIGURACIÓN GLOBAL Y CONEXIONES (Core v2)
 * ===============================================================
 */

const APP_CONFIG = {
  // 1. Conexión a Base de Datos (Spreadsheet)
  SPREADSHEET_ID: '1OpRmcCY4BEN8KeJUPiF1N5Uzex7I3OrR0EJesqfZGo0',
  TIMEZONE: "America/Lima",

  // 2. Nombres de Hojas (Core + Negocio)
  SHEETS: {
    // Sistema
    USUARIOS: 'usuarios',
    PAGINAS: 'Paginas',
    ROLES: "Roles", // Requerido por Core v2
    BANNER_HOME: "banner_home", // Requerido por Core v2
    
    // Negocio (Seguimineto)
    INDICADORES: 'Indicadores',
    ACTIVIDADES: 'Actividades',
    RIESGOS: 'Riesgos',
    CAPACITACIONES: 'Capacitaciones',
    REVISIONES: 'Revisiones',
    AREAS: 'Areas',
    PEI: 'Pei',
    VINCULACION: 'Vinculacion'
  },

  // 3. Branding y Seguridad
  NAME: 'Recoleccion de Informacion',
  LOGO: 'https://i.postimg.cc/RVgcXF3f/logo_uac_blanco.png',
  LOGIN_BG: 'https://i.postimg.cc/t4RzjJzc/UAC-frontis.jpg',
  DOMAIN: 'uandina.edu.pe',
  VERSION: '2.1.1' 
};