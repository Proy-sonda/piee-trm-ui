export interface FormularioFiltrarLicenciasTramitadas {
  folio: string;
  idEstado: number;
  runPersonaTrabajadora: string;
  fechaDesde: Date;
  fechaHasta: Date;
  rutEntidadEmpleadora: string;
  idUnidadRRHH: string;
  tipoPeriodo: 'fecha-emision' | 'fecha-tramitacion';
}
