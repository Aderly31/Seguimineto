function actividades_list() {
  const session = Auth.getSession();
  if (!session) throw new Error("Sesión no válida");

  try {
    const data = SheetService.readObjects(APP_CONFIG.SHEETS.ACTIVIDADES);
    return { success: true, data: data, total: data.length };
  } catch (e) {
    console.error('actividades_list: ' + e.message);
    return { success: false, message: e.message };
  }
}
