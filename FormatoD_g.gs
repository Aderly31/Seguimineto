/**
 * FormatoD_g.gs - Módulo de Capacitaciones e Interacción
 */

function cap_get_all() {
  const data = SheetService.readObjects_(APP_CONFIG.SHEETS.CAPACITACIONES);
  return data.map(it => ({
    id: it.id,
    nombre: it.nombre,
    fecha: it.fecha,
    modalidad: it.modalidad,
    participantes: it.participantes,
    estado: it.estado || 'BORRADOR',
    tiene_evidencia: it.tiene_evidencia === 'SI' || it.tiene_evidencia === true
  }));
}

function cap_registrar(data) {
  try {
    const isEdit = !!data.id;
    const rowData = {
      id: data.id || Utilities.getUuid(),
      nombre: data.nombre,
      fecha: data.fecha,
      modalidad: data.modalidad,
      participantes: data.participantes,
      estado: 'BORRADOR',
      tiene_evidencia: 'NO',
      fecha_registro: new Date()
    };

    if (isEdit) {
      const success = SheetService.updateObjectById_(APP_CONFIG.SHEETS.CAPACITACIONES, data.id, rowData);
      return { success };
    } else {
      // Usamos los encabezados de la hoja para mapear el objeto
      SheetService.saveObject_(APP_CONFIG.SHEETS.CAPACITACIONES, rowData);
      return { success: true };
    }
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Compatibilidad
function formatoD_getTrainings() { return cap_get_all(); }
function formatoD_getSummary() {
  const items = cap_get_all();
  const total = items.length;
  const enviados = items.filter(i => i.estado === 'ENVIADO').length;
  const cumplimiento = total ? Math.round((enviados / total) * 100) : 0;
  
  return {
    cumplimientoGeneral: cumplimiento,
    totalCapacitaciones: total,
    totalParticipantes: items.reduce((acc, it) => acc + Number(it.participantes || 0), 0)
  };
}
