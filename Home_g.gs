/**
 * Home_g.gs
 * Lógica para el Dashboard principal basada en datos reales de Sheets.
 */

function home_getDashboardData() {
  const session = Auth.getSession();
  
  // Lectura de datos reales
  const indicadores = SheetService.readObjects_(APP_CONFIG.SHEETS.INDICADORES);
  const actividades = SheetService.readObjects_(APP_CONFIG.SHEETS.ACTIVIDADES);
  const riesgos     = SheetService.readObjects_(APP_CONFIG.SHEETS.RIESGOS);
  const capacitaciones = SheetService.readObjects_(APP_CONFIG.SHEETS.CAPACITACIONES);

  // Cálculo de progreso por formato
  const calcAvance = (items) => {
    if (!items.length) return 0;
    const total = items.length;
    const completados = items.filter(it => 
      ['Aprobado', 'Completado', 'Finalizado', 'Enviado'].includes(it.estado)
    ).length;
    return Math.round((completados / total) * 100);
  };

  const progresoA = calcAvance(indicadores);
  const progresoB = calcAvance(actividades);
  const progresoC = calcAvance(riesgos);
  const progresoD = calcAvance(capacitaciones);

  return {
    periodo: "2024 - Semestre I",
    progreso: [
      { nombre: 'Formato A', porcentaje: progresoA, detalle: `${indicadores.length} registros`, estado: progresoA === 100 ? 'Completo' : 'Pendiente', color: 'blue' },
      { nombre: 'Formato B', porcentaje: progresoB, detalle: `${actividades.length} registros`, estado: progresoB === 100 ? 'Completo' : 'Pendiente', color: 'orange' },
      { nombre: 'Formato C', porcentaje: progresoC, detalle: `${riesgos.length} registros`, estado: progresoC === 100 ? 'Completo' : 'Pendiente', color: 'red' },
      { nombre: 'Formato D', porcentaje: progresoD, detalle: `${capacitaciones.length} registros`, estado: progresoD === 100 ? 'Completo' : 'Pendiente', color: 'gray' }
    ],
    alertas: [
      { tipo: 'warning', icon: 'fa-triangle-exclamation', titulo: 'Formato C Pendiente', mensaje: 'Faltan evidencias de mitigación de riesgos.', accion: 'Resolver' }
    ],
    actividad: [
      { tiempo: 'Hace 5 min', titulo: 'Indicador Actualizado', usuario: session.name, color: 'blue' }
    ]
  };
}
