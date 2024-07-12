export interface FormularioFiltrarLicencias {
  folio: string;
  runPersonaTrabajadora: string;
  fechaDesde: Date;
  fechaHasta: Date;
  rutEntidadEmpleadora: string;
  idUnidadRRHH: number;
  // filtroSemaforo: 'por-tramitar' | 'por-vencer' | 'vencido';
}
