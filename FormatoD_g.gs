/**
 * FormatoD_g.gs
 * Lógica para la gestión de Capacitaciones y Talleres
 */

function formatoD_getTrainings() {
  const session = Auth.getSession();
  
  // Datos de ejemplo basados en la captura (Imagen 6)
  return [
    {
      id: 'CAP-001',
      nombre: 'Herramientas Pedagógicas Avanzadas',
      fecha: '12 de Marzo, 2024',
      modalidad: 'Virtual',
      participantes: 45,
      estado: 'ENVIADO',
      evidenciaCompleta: true,
      progresoEvidencia: 100
    },
    {
      id: 'CAP-002',
      nombre: 'Taller de Ética en la Investigación',
      fecha: '05 de Abril, 2024',
      modalidad: 'Presencial',
      participantes: 12,
      estado: 'BORRADOR',
      evidenciaCompleta: false,
      progresoEvidencia: 20
    },
    {
      id: 'CAP-003',
      nombre: 'Fundamentos de Ciberseguridad',
      fecha: '19 de Mayo, 2024',
      modalidad: 'Virtual',
      participantes: 110,
      estado: 'ENVIADO',
      evidenciaCompleta: true,
      progresoEvidencia: 100
    }
  ];
}

function formatoD_getSummary() {
  return {
    cumplimientoGeneral: 65,
    totalCapacitaciones: 18,
    totalParticipantes: 350
  };
}
