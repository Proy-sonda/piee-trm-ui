export interface FormularioNoTramitarLicencia {
  /** El ID del motivo de rechazo */
  motivoRechazo: string;
  otroMotivoDeRechazo: string;
  fechaTerminoRelacion: Date;
  documentoAdjunto: File[];
  entidadPagadoraId: string;
}
