import { TipoLicencia } from "./tipo-licencia";

export interface FormularioFiltrarLicencias {
  folio: string;
  runPersonaTrabajadora: string;
  fechaDesde: Date;
  fechaHasta: Date;
  rutEntidadEmpleadora: string;
  idUnidadRRHH: number;
  filtroTipoLicencia: number;
  // filtroSemaforo: 'por-tramitar' | 'por-vencer' | 'vencido';
}
