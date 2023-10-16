export type MotivoDeRechazo =
  | 'inexistencia-relacion-laboral'
  | 'relacion-laboral-terminada'
  | 'permiso-sin-goce-de-sueldo'
  | 'trabajador-publico-feriado-legal'
  | 'otro';

export interface FormularioNoTramitarLicencia {
  motivoRechazo: MotivoDeRechazo;
  otroMotivoDeRechazo: string;
  fechaTerminoRelacion: Date;
  documentoAdjunto: File[];
  entidadPagadoraId: string;
}

/** Se sacan de la base de datos */
const mapaMotivos: Record<MotivoDeRechazo, number> = {
  'inexistencia-relacion-laboral': 1,
  'relacion-laboral-terminada': 2,
  'permiso-sin-goce-de-sueldo': 3,
  'trabajador-publico-feriado-legal': 4,
  otro: 5,
};

export const idMotivoRechazo = (motivo: MotivoDeRechazo) => mapaMotivos[motivo];
