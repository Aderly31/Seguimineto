/**
 * BandejaRevision_g.gs
 * Lógica para la administración y revisión con persistencia real.
 */

function bandeja_getInbox() {
  const session = Auth.getSession();
  
  // En una versión real, esto leería de una tabla de 'Envíos' 
  // Por ahora, simulamos el inbox pero permitimos filtrar áreas
  return {
    filtros: {
      areas: ['Todas las Áreas', 'Facultad de Medicina', 'Dpto. Ingeniería', 'Biblioteca Central'],
      estados: ['Todos los Estados', 'Pendiente', 'En Revisión', 'Observado', 'Aprobado']
    },
    enviosRecientes: [
      { id: 'env-001', titulo: 'Facultad de Medicina', fecha: 'Hoy', area: 'Académica', estado: 'PENDIENTE' },
      { id: 'env-002', titulo: 'Dpto. de Ingeniería', fecha: 'Ayer', area: 'Administrativa', estado: 'EN REVISIÓN' }
    ]
  };
}

function bandeja_getDetails(id) {
  // Obtenemos datos reales de indicadores para mostrar en la revisión
  const indicadores = SheetService.readObjects_(APP_CONFIG.SHEETS.INDICADORES);
  
  return {
    facultad: 'Área Seleccionada',
    periodo: '2024 - I',
    metricas: {
      totalEnvios: indicadores.length,
      tendenciaPositiva: '+0',
      pendientes: indicadores.filter(i => i.estado !== 'Aprobado').length,
      prioridadAlta: true,
      aprobados: indicadores.filter(i => i.estado === 'Aprobado').length,
      porcentajeAprobacion: '0%'
    },
    indicadores: indicadores.slice(0, 4).map(i => ({
      id: i.id,
      nombre: i.nombre,
      valor: i.avance + '%'
    })),
    evaluacionCualitativa: "Resumen dinámico del desempeño del área basado en los registros actuales.",
    timeline: [
      { fecha: new Date().toLocaleString(), titulo: 'Vista Previa Generada', desc: 'Sistema', color: 'blue' }
    ]
  };
}

function bandeja_updateStatus(id, status, comments) {
  const session = Auth.getSession();
  
  const log = {
    timestamp: new Date(),
    envioId: id,
    facultad: 'Facultad Destino',
    revisorEmail: session.email,
    decision: status,
    comentarios: comments
  };
  
  SheetService.saveObject_(APP_CONFIG.SHEETS.REVISIONES, log);
  
  return { success: true, message: `El envío ha sido marcado como ${status} y registrado en el historial.` };
}
