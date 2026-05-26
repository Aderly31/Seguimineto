/**
 * ===============================================================
 * CONFIGURACIÓN GLOBAL Y CONEXIONES (Core v2)
 * ===============================================================
 */

const APP_CONFIG = {
  // 1. Conexión a Base de Datos (Spreadsheet)
  SPREADSHEET_ID: '1OpRmcCY4BEN8KeJUPiF1N5Uzex7I3OrR0EJesqfZGo0',
  TIMEZONE: "America/Lima",

  // 2. Nombres de Hojas de Sistema (Permisos y Contenido)
  SHEETS: {
    USUARIOS: "Usuarios",
    PAGINAS: "paginas",
    ROLES: "Roles",
    BANNER_HOME: "banner_home",
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

  // 3. Definición de Columnas por Módulo
  COLUMNS: {
    USUARIOS: [
      'Email', 'Nombre', 'Apellido', 'Rol', 'Estado'
    ],
    PAGINAS: [
      'titulo', 'url', 'activo', 'rol', 'padre'
    ],
    ROLES: [
      'rol', 'descripcion'
    ]
  },

  // 4. Branding y Seguridad
  NAME: 'Central de Informes',
  LOGO: 'https://i.postimg.cc/RVgcXF3f/logo_uac_blanco.png',
  LOGIN_BG: 'https://i.postimg.cc/t4RzjJzc/UAC-frontis.jpg',
  DOMAIN: 'uandina.edu.pe',
  VERSION: '2.4.7'
};

const SCHEMA = [
  {
    name: APP_CONFIG.SHEETS.INDICADORES,
    headers: ['id', 'nombre', 'area', 'codAei', 'metaAnual', 'resultadoSemestre', 'avance', 'estado', 'responsable', 'fuente', 'detallesfuente', 'enlace', 'fechaCreacion']
  },
  {
    name: APP_CONFIG.SHEETS.ACTIVIDADES,
    headers: ['id', 'titulo', 'area', 'codAei', 'descripcion', 'impacto', 'estado', 'imagen', 'fechaCreacion']
  },
  {
    name: APP_CONFIG.SHEETS.RIESGOS,
    headers: ['id', 'riesgo', 'area', 'codAei', 'causa', 'impacto', 'prioridad', 'accion', 'estado', 'fechaObjetivo', 'fechaCreacion']
  },
  {
    name: APP_CONFIG.SHEETS.CAPACITACIONES,
    headers: ['id', 'nombre', 'area', 'codAei', 'fecha', 'modalidad', 'participantes', 'progresoEvidencia', 'estado', 'fechaCreacion']
  },
  {
    name: APP_CONFIG.SHEETS.REVISIONES,
    headers: ['timestamp', 'envioId', 'facultad', 'revisorEmail', 'decision', 'comentarios']
  },
  {
    name: APP_CONFIG.SHEETS.AREAS,
    headers: ['area', 'descripcion', 'dependencia']
  },
  {
    name: APP_CONFIG.SHEETS.PEI,
    headers: ['Código', 'Descripción', 'Nombre del indicador 1/', 'Logro Alcanzado 2025 2/', 'Medio de Verificación 3/']
  },
  {
    name: APP_CONFIG.SHEETS.VINCULACION,
    headers: ['area', 'codAei']
  }
];
