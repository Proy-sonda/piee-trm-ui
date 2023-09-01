export interface UsuarioEmpleador {
  idusuarioempleador: number;
  usuario: Usuario;
  empleador: Empleador;
  unidad: Unidad;
}

export interface Empleador {
  idempleador: number;
  rutempleador: string;
  razonsocial: string;
  nombrefantasia: string;
  telefonohabitual: string;
  telefonomovil: string;
  email: string;
  holding: string;
}

export interface Unidad {
  idunidad: number;
  unidad: string;
  identificador: string;
  email: string;
  telefono: string;
}

export interface Usuario {
  idusuario: number;
  fecharegistro: Date;
  rutusuario: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefonouno: string;
  telefonodos: string;
}
