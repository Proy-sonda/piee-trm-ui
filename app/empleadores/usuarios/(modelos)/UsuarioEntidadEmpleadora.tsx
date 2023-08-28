import { RolUsuario } from './RolUsuario';

// TODO: Renombrar propiedades de acuerdo a lo que venga del backend. con F2
export interface UsuarioEntidadEmpleadora {
  id: number;
  rut: string;
  nombres: string;
  apellidos: string;
  telefono1: string;
  telefono2: string;
  email: string;
  estado: string;
  rol: RolUsuario;
}
