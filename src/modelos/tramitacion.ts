export interface DatoEmpleadorUnidad {
  empleadores: Empleadore[];
  trabajadoresunidadrrhh: Trabajadoresunidadrrhh[];
  unidadesrrhh: Unidadesrrhh[];
  usuarios: Usuario[];
  usuariosunidad: Usuariosunidad[];
}

export interface Usuariosunidad {
  RunUsuario: string;
  ApellidoPaternoUsuario: string;
  ApellidoMaternoUsuario: string;
  NombresUsuario: string;
  RolUsuario: number;
}

export interface Usuario {
  runusuario: string;
  apellidosusuario: string;
  nombresusuario: string;
  rolusuario: number;
  telefono: string;
  telefonomovil: string;
  correoelectronicousuario: string;
}

export interface Unidadesrrhh {
  CodigoUnidadRRHH: string;
  CodigoOperador: number;
  GlosaUnidadRRHH: string;
  CodigoRegion: string;
  CodigoComuna: string;
  CodigoTipoCalle: number;
  Direccion: string;
  Numero: string;
  BlockDepto: string;
  Telefono: string;
}

export interface Trabajadoresunidadrrhh {
  RunTrabajador: string;
  FechaRegistro: string;
}

export interface Empleadore {
  rutempleador: string;
  nombrerazonsocial: string;
  nombrefantasia: string;
  tipoempleador: number;
  codigoccaf: number;
  codigoactividadlaboral: number;
  codigoregion: string;
  codigocomuna: string;
  codigotipocalle: number;
  direccion: string;
  numero: string;
  blockdepto: string;
  telefono1: string;
  telefono2: string;
  correoelectronico: string;
  codigocantidadtrabajadores: number;
  codigosistemaremuneraciones: number;
}
