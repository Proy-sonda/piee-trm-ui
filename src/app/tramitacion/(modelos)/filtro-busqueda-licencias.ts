export interface FiltroBusquedaLicencias {
  folio?: string;
  runPersonaTrabajadora?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  rutEntidadEmpleadora?: string;
  unidadRRHH?: {
    codigoUnidad: string;
    idOperador: number;
  };
  tipolicencia?: number;
}

export const hayFiltros = (filtros: FiltroBusquedaLicencias) => {
  return (
    filtros.folio !== undefined ||
    filtros.runPersonaTrabajadora !== undefined ||
    filtros.fechaDesde !== undefined ||
    filtros.fechaHasta !== undefined ||
    filtros.rutEntidadEmpleadora !== undefined ||
    filtros.unidadRRHH !== undefined ||
    filtros.tipolicencia !== undefined
  );
};
