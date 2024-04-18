export interface FormularioNoTramitarLicencia {
  /** El ID del motivo de rechazo en string . */
  motivoRechazo: string;
  otroMotivoDeRechazo: string;
  fechaTerminoRelacion: Date;
  documentoAdjunto: FileList;
  entidadPagadoraId: number;
  entidadPagadoraLetra:string;
  entidadpagadora?: EntidadPagadora
}

interface EntidadPagadora {
  identidadpagadora: string;
  entidadpagadora:string;
}
