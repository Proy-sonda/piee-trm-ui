export interface FiltroBusquedaLicenciasTramitadas {
  folio?: string;
  runPersonaTrabajadora?: string;
  idEstado?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
  rutEntidadEmpleadora?: string;
  idUnidadRRHH?: string;
  tipoPeriodo?: 'fecha-emision' | 'fecha-tramitacion';
}

export const hayFiltros = (filtros: FiltroBusquedaLicenciasTramitadas) => {
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
