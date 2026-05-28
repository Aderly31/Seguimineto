function capacitaciones_list() {
  try {
    const session = Auth.getSession();
    if (!session) return { success: false, message: "Sesión no válida" };

    const data = SheetService.readObjects(APP_CONFIG.SHEETS.CAPACITACIONES);
    return { success: true, data: data, total: data.length };
  } catch (e) {
    console.error('capacitaciones_list: ' + e.message);
    return { success: false, message: e.message };
  }
}
