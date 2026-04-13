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
  // Obtenemos datos reales y calculados de los indicadores
  const indicadores = indicadores_list();
  
  // Ordenar por menor avance para mostrar los más críticos primero
  const criticos = indicadores
    .sort((a, b) => a.avance - b.avance)
    .slice(0, 4);

  const aprobadosCount = indicadores.filter(i => i.estado === 'Aprobación' || i.estado === 'Verificado' || i.avance === 100).length;
  const porcentajeAprobacion = indicadores.length ? ((aprobadosCount / indicadores.length) * 100).toFixed(0) : 0;
  
  return {
    facultad: 'Facultad de Medicina', // Simulado por ahora, debería venir de la tabla de Envíos
    periodo: '2026 - I',
    metricas: {
      totalEnvios: indicadores.length,
      tendenciaPositiva: '+5.2%',
      pendientes: indicadores.filter(i => i.avance < 100).length,
      prioridadAlta: true,
      aprobados: aprobadosCount,
      porcentajeAprobacion: porcentajeAprobacion + '%'
    },
    indicadores: criticos.map(i => ({
      id: i.id.substring(0, 8), // Acortar ID para la vista
      nombre: i.nombre,
      valor: i.avance + '%'
    })),
    evaluacionCualitativa: "El área muestra un desempeño consistente con una tendencia positiva en los indicadores de gestión académica. Se requiere atención en los indicadores con avance menor al 50%.",
    timeline: [
      { fecha: new Date().toLocaleDateString(), titulo: 'Envío Recibido', desc: 'Recibido por el sistema central', color: 'blue' },
      { fecha: 'Hace 2 horas', titulo: 'Asignación de Revisor', desc: 'Asignado automáticamente a Planificación', color: 'blue' }
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
