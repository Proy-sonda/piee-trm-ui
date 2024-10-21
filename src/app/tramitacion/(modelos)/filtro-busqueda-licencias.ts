export interface FiltroBusquedaLicencias {
  folio?: string;
  runPersonaTrabajadora?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  rutEntidadEmpleadora?: string;
  /** Primero el codigo de la unidad y luego el codigo del operador */
  idUnidadRRHH?: `${string}|${number}`;
  tipolicencia?: number;
}

export const hayFiltros = (filtros: FiltroBusquedaLicencias) => {
  return (
    filtros.folio !== undefined ||
    filtros.runPersonaTrabajadora !== undefined ||
    filtros.fechaDesde !== undefined ||
    filtros.fechaHasta !== undefined ||
    filtros.rutEntidadEmpleadora !== undefined ||
    filtros.idUnidadRRHH !== undefined ||
    filtros.tipolicencia !== undefined
  );
};
