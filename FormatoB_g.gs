/**
 * FormatoB_g.gs - Módulo de Actividades y Logros
 */

function actividades_list() {
  const data = SheetService.readObjects_(APP_CONFIG.SHEETS.ACTIVIDADES);
  return data.map(it => ({
    id: it.id,
    titulo: it.titulo,
    descripcion: it.descripcion,
    tipo: it.tipo || it.categoria,
    categoria: it.categoria || it.tipo,
    estado: it.estado || 'EN PROGRESO',
    impacto: it.impacto,
    objetivo_pei: it.objetivo_pei || it.objetivoPEI,
    imagen_url: it.imagen_url || it.imagen || 'https://i.postimg.cc/t4RzjJzc/UAC-frontis.jpg',
    fecha: it.fecha_registro || it.fecha
  }));
}

function actividades_guardar(data) {
  try {
    const isEdit = !!data.id;
    const row = [
      data.id || Utilities.getUuid(),
      data.titulo,
      data.descripcion,
      data.tipo || 'General',
      data.estado || 'EN PROGRESO',
      data.impacto || '',
      data.objetivo || '',
      data.url || '',
      new Date()
    ];

    if (isEdit) {
      // Si implementamos updateObjectById_ para arrays, lo usaríamos aquí.
      // Por ahora, para simplificar y seguir el snippet del usuario, usamos appendData para nuevos.
      // Si es una edición, podrías buscar la fila y reemplazarla.
      // Dado que el snippet del usuario usa google.script.run.actividades_guardar, 
      // lo manejaremos como inserción por ahora o actualización si el ID existe en la hoja.
      
      const success = SheetService.updateObjectById_(APP_CONFIG.SHEETS.ACTIVIDADES, data.id, {
        titulo: data.titulo,
        descripcion: data.descripcion,
        tipo: data.tipo,
        estado: data.estado,
        impacto: data.impacto,
        objetivo_pei: data.objetivo,
        imagen_url: data.url
      });
      return { success };
    } else {
      SheetService.appendData(APP_CONFIG.SHEETS.ACTIVIDADES, row);
      return { success: true };
    }
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Compatibilidad
function formatoB_getActivities() { return actividades_list(); }
