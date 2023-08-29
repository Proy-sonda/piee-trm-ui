import { EstadoUsuario } from './EstadoUsuario';
import { RolUsuario } from './RolUsuario';

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
