export interface FormularioFiltrarLicenciasTramitadas {
  folio: string;
  runPersonaTrabajadora: string;
  idEstado: number;
  /** 1: Fecha Emisión | 2: Fecha Tramitación */
  tipoPeriodo: 1 | 2;
  fechaDesde: Date;
  fechaHasta: Date;
  rutEntidadEmpleadora: string;
  idUnidadRRHH: string;
}
