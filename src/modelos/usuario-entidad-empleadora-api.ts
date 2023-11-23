import { UsuarioEmpleador } from './usuario-empleador';

export interface UsuarioEntidadEmpleadoraAPI {
  idusuario: number;
  rutusuario: string;
  nombres: string;
  apellidos: string;
  usuarioempleador: UsuarioEmpleador[];
}
