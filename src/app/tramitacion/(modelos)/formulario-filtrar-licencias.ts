export interface FormularioFiltrarLicencias {
  folio: string;
  runPersonaTrabajadora: string;
  fechaDesde: Date;
  fechaHasta: Date;
  rutEntidadEmpleadora: string;
  /** Primero el codigo de la unidad y luego el codigo del operador */
  idUnidadRRHH: `${string}|${number}`;
  filtroTipoLicencia: number;
}
