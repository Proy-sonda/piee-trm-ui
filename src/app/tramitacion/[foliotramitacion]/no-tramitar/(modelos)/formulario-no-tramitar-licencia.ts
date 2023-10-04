export interface FormularioNoTramitarLicencia {
  motivoRechazo:
    | 'inexistencia-relacion-laboral'
    | 'relacion-laboral-terminada'
    | 'permiso-sin-goce-de-sueldo'
    | 'otro';
  otroMotivoDeRechazo: string;
  documentoAdjunto?: File;
}
