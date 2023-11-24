export interface UsuarioEmpleador {
  empleador: Empleador;
  estadousuario: Estadousuario;
  rol: Rol;
  email: string;
  telefonouno: string;
  telefonodos: string;
  idusuarioempleador: number;
}

interface Empleador {
  idempleador: number;
  rutempleador: string;
  razonsocial: string;
  nombrefantasia: string;
  telefonohabitual: string;
  telefonomovil: string;
  email: string;
  holding: string;
  fecharegistro: string;
}

interface Estadousuario {
  idestadousuario: number;
  descripcion: string;
}

interface Rol {
  idrol: number;
  rol: string;
}
