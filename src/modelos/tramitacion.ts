export interface DatoEmpleadorUnidad {
  empleadores: Empleadore[];
  trabajadoresunidadrrhh: Trabajadoresunidadrrhh[];
  unidadesrrhh: Unidadesrrhh[];
  usuarios: Usuario[];
  usuariosunidad: Usuariosunidad[];
}

export interface Usuariosunidad {
  runusuario: string;
  rolusuario: string;
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
  codigounidadrrhh: string;
  glosaunidadrrhh: string;
  codigoregion: string;
  codigocomuna: string;
  codigotipocalle: number;
  direccion: string;
  numero: string;
  blockdepto: string;
  telefono: string;
}

export interface Trabajadoresunidadrrhh {
  runtrabajador: string;
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
