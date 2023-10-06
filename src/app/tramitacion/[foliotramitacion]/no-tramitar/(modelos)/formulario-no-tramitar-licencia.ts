export interface FormularioNoTramitarLicencia {
  motivoRechazo:
    | 'inexistencia-relacion-laboral'
    | 'relacion-laboral-terminada'
    | 'permiso-sin-goce-de-sueldo'
    | 'trabajador-publico-feriado-legal'
    | 'otro';
  otroMotivoDeRechazo: string;
  fechaTerminoRelacion: Date;
  documentoAdjunto: File[];
  entidadPagadoraId: string;
}
