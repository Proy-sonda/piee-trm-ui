export interface FiltroBusquedaLicenciasHistoricas {
  folio?: string;
  runPersonaTrabajadora?: string;
  idEstado?: number;
  tipoPeriodo?: 'fecha-emision' | 'fecha-tramitacion';
  fechaDesde?: Date;
  fechaHasta?: Date;
  rutEntidadEmpleadora?: string;
  idUnidadRRHH?: string;
}

export const hayFiltrosLicenciasHistoricas = (filtros: FiltroBusquedaLicenciasHistoricas) => {
  return (
    filtros.folio !== undefined ||
    filtros.runPersonaTrabajadora !== undefined ||
    filtros.idEstado !== undefined ||
    filtros.fechaDesde !== undefined ||
    filtros.fechaHasta !== undefined ||
    filtros.rutEntidadEmpleadora !== undefined ||
    filtros.idUnidadRRHH !== undefined ||
    filtros.tipoPeriodo !== undefined
  );
};
