# Core SPA v2 - Motor de Aplicaciones Premium

Este es un núcleo (Core) optimizado para Google Apps Script, extraído de sistemas de alto rendimiento y estandarizado para ser usado como base en cualquier nuevo proyecto. Esta versión **v2** incluye mejoras en la estructura del sidebar y limpieza de código.

## 📁 Estructura de Archivos

1.  **Codigo.gs**: Motor de backend. Contiene el sistema de permisos dinámico (Usuarios, Roles, Páginas) y funciones de utilidad para manipulación de datos en Google Sheets.
2.  **Index.html**: Contenedor principal de la interfaz (Shell). Maneja el Sidebar y la inyección de módulos.
3.  **Estilos.html**: Sistema de diseño basado en CSS Variables. Incluye soporte para modo colapsado, responsividad y animaciones suaves.
4.  **JavaScript.html**: Motor de navegación SPA (Single Page Application). Permite cambiar de vistas instantáneamente sin recargar la página.

## 🚀 Cómo empezar

1.  **Configurar Spreadsheet**:
    *   Crea una hoja de cálculo con las pestañas: `Usuarios`, `Roles`, `Paginas`, `Carpetas`.
    *   Copia el ID de la hoja y pégalo en la constante `ID_SS` en `Codigo.gs`.
2.  **Añadir Módulos**:
    *   Crea un nuevo archivo HTML (ej. `MiModulo.html`).
    *   Inyéctalo en `Index.html` usando `<?!= include('MiModulo'); ?>`.
    *   Regístralo en la pestaña `Paginas` de tu hoja de cálculo para que aparezca en el menú.
3.  **Desplegar**:
    *   Despliega como Aplicación Web en Google Apps Script.

## ✨ Características Incluidas
*   **Diseño Premium**: Tipografía Inter, sombras suaves y colores modernos.
*   **SPA Real**: Navegación fluida controlada por `navTo(viewId)`.
*   **Permisos Granulares**: El menú se construye dinámicamente según el rol del usuario activo.
*   **Buscador Universal**: Filtro en tiempo real para cualquier tabla dentro de los módulos.
*   **Notificaciones**: Integración con SweetAlert2 para una experiencia de usuario superior.

---
*Optimizado por Antigravity*
# core-v2
