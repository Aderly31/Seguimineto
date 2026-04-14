function formatoB_get() {
  const data = SheetService.readObjects_(APP_CONFIG.SHEETS.ACTIVIDADES);
  return data.map(it => ({
    id: String(it.id || ''),
    titulo: it.titulo || '',
    descripcion: it.descripcion || '',
    tipo: it.tipo || it.categoria || 'General',
    estado: it.estado || 'FINALIZADO',
    impacto: it.impacto || '',
    fecha: it.fecha || '',
    beneficiarios: it.beneficiarios || '',
    eje: it.ejeestrategico || it.eje || '',
    imagen: it.imagen || it.imagenurl || 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600'
  }));
}

function formatoB_save(data) {
  try {
    const isEdit = !!data.id;
    // Asegúrate que tu Excel tenga estas columnas: id, titulo, descripcion, tipo, estado, impacto
    const rowData = {
      id: data.id || Utilities.getUuid(),
      titulo: data.titulo,
      fecha: data.fecha,
      descripcion: data.descripcion,
      tipo: data.tipo,
      estado: data.estado,
      impacto: data.impacto,
      beneficiarios: data.beneficiarios,
      ejeestrategico: data.eje,
    };

    if (isEdit) {
      return { success: SheetService.updateObjectById_(APP_CONFIG.SHEETS.ACTIVIDADES, data.id, rowData) };
    } else {
      SheetService.saveObject_(APP_CONFIG.SHEETS.ACTIVIDADES, rowData);
      return { success: true };
    }
  } catch(e) { return { success: false, message: String(e) }; }
}