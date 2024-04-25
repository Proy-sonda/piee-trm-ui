export interface Usuarios {
  fecharegistro: string;
  rutusuario: string;
  nombres: string;
  apellidos: string;
  usuarioempleador: Usuarioempleador[];
  idusuario: number;
}

export interface Usuarioempleador {
  empleador: Empleador;
  estadousuario: Estadousuario;
  rol: Rol;
  email: string;
  telefonouno?: any;
  telefonodos?: any;
  idusuarioempleador: number;
}

interface Rol {
  idrol: number;
  rol: string;
}

interface Estadousuario {
  idestadousuario: number;
  descripcion: string;
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
