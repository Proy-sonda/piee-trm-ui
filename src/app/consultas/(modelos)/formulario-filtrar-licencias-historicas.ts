export interface FormularioFiltrarLicenciasHistoricas {
  folio: string;
  runPersonaTrabajadora: string;
  idEstado: number;
  /**  1: Fecha Emisión 2: Fecha Tramitación */
  tipoPeriodo: 1 | 2;
  fechaDesde: Date;
  fechaHasta: Date;
  rutEntidadEmpleadora: string;
  /** Primero el codigo de la unidad y luego el codigo del operador */
  idUnidadRRHH: `${string}|${number}`;
}
