export interface DatosFiltroLicencias {
  folio?: string;
  runPersonaTrabajadora?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  rutEntidadEmpleadora?: string;
  idUnidadRRHH?: number;
}

export const hayFiltros = (filtros: DatosFiltroLicencias) => {
  return (
    filtros.folio !== undefined ||
    filtros.runPersonaTrabajadora !== undefined ||
    filtros.fechaDesde !== undefined ||
    filtros.fechaHasta !== undefined ||
    filtros.rutEntidadEmpleadora !== undefined ||
    filtros.idUnidadRRHH !== undefined
  );
};
