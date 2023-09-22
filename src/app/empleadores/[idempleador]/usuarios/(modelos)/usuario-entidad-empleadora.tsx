import { EstadoUsuario } from './estado-usuario';
import { RolUsuario } from './rol-usuario';

export interface UsuarioEntidadEmpleadora {
  idusuario: number;
  rutusuario: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefonouno: string;
  telefonodos: string;
  rol: RolUsuario;
  estadousuario: EstadoUsuario;
}