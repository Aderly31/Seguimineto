function riesgos_list() {
  const session = Auth.getSession();
  if (!session) throw new Error("Sesión no válida");

  try {
    const data = SheetService.readObjects(APP_CONFIG.SHEETS.RIESGOS);
    return { success: true, data: data, total: data.length };
  } catch (e) {
    console.error('riesgos_list: ' + e.message);
    return { success: false, message: e.message };
  }
}
