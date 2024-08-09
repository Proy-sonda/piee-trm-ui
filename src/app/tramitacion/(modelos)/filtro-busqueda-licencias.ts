import { TipoLicencia } from "./tipo-licencia";

export interface FiltroBusquedaLicencias {
  folio?: string;
  runPersonaTrabajadora?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  rutEntidadEmpleadora?: string;
  idUnidadRRHH?: number;
  tipolicencia?:number;
  // filtroSemaforo?: 'por-tramitar' | 'por-vencer' | 'vencido';
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
    // || filtros.filtroSemaforo !== undefined
  );
};
