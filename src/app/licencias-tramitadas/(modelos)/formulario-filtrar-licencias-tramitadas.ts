export interface FormularioFiltrarLicenciasTramitadas {
  folio: string;
  runPersonaTrabajadora: string;
  idEstado: number;
  tipoPeriodo: 'fecha-emision' | 'fecha-tramitacion';
  fechaDesde: Date;
  fechaHasta: Date;
  rutEntidadEmpleadora: string;
  idUnidadRRHH: string;
}
