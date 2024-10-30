import { IdUnidadComboUnidades } from '@/components';

export interface FormularioFiltrarLicencias {
  folio: string;
  runPersonaTrabajadora: string;
  fechaDesde: Date;
  fechaHasta: Date;
  rutEntidadEmpleadora: string;
  idUnidadRRHH: IdUnidadComboUnidades;
  filtroTipoLicencia: number;
}
