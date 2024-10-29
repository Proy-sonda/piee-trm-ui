export interface FiltroBusquedaLicenciasHistoricas {
  folio?: string;
  runPersonaTrabajadora?: string;
  idEstado?: number;
  /** 0: No Aplica; 1: Fecha Emisión 2: Fecha Tramitación */
  tipoPeriodo: 0 | 1 | 2;
  fechaDesde?: Date;
  fechaHasta?: Date;
  rutEntidadEmpleadora?: string;
  unidadRRHH?: {
    codigoUnidad: string;
    idOperador: number;
  };
}

export const hayFiltrosLicenciasHistoricas = (filtros: FiltroBusquedaLicenciasHistoricas) => {
  return (
    filtros.folio !== undefined ||
    filtros.runPersonaTrabajadora !== undefined ||
    filtros.idEstado !== undefined ||
    filtros.fechaDesde !== undefined ||
    filtros.fechaHasta !== undefined ||
    filtros.rutEntidadEmpleadora !== undefined ||
    filtros.unidadRRHH !== undefined ||
    filtros.tipoPeriodo !== undefined
  );
};
