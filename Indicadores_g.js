function indicadores_list() {
  const session = Auth.getSession();
  if (!session) throw new Error("Sesión no válida");

  try {
    const data = SheetService.readObjects(APP_CONFIG.SHEETS.INDICADORES);
    return { success: true, data: data, total: data.length };
  } catch (e) {
    console.error('indicadores_list: ' + e.message);
    return { success: false, message: e.message };
  }
}
