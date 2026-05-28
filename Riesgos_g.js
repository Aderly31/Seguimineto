function riesgos_list() {
  try {
    const session = Auth.getSession();
    if (!session) return { success: false, message: "Sesión no válida" };

    const data = SheetService.readObjects(APP_CONFIG.SHEETS.RIESGOS);
    return { success: true, data: data, total: data.length };
  } catch (e) {
    console.error('riesgos_list: ' + e.message);
    return { success: false, message: e.message };
  }
}
