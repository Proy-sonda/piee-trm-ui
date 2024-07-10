export interface FiltroBusquedaLicenciasTramitadas {
  folio?: string;
  runPersonaTrabajadora?: string;
  idEstado?: number;
  /** 1: Fecha Emisión | 2: Fecha Tramitación | undefined = no aplica*/
  tipoPeriodo?: 1 | 2;
  fechaDesde?: Date;
  fechaHasta?: Date;
  rutEntidadEmpleadora?: string;
  idUnidadRRHH?: string;
}

export const hayFiltrosLicenciasTramitadas = (filtros: FiltroBusquedaLicenciasTramitadas) => {
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
