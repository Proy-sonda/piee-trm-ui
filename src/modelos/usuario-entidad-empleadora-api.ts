import { UsuarioEmpleador } from './usuario-empleador';

export interface UsuarioEntidadEmpleadoraAPI {
  idusuario: number;
  rutusuario: string;
  nombres: string;
  apellidopaterno: string;
  apellidomaterno: string;
  usuarioempleador: UsuarioEmpleador[];
}
