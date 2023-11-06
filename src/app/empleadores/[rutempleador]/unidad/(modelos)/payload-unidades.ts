export interface EmpleadorUnidad {
  RutEmpleador: string;
  RunUsuario: string;
  unidadesrrhh?: Unidadesrrhh;
  usuarioxrrhh?: Usuarioxrrhh;
  trabajadoresxrrhh?: Trabajadoresxrrhh;
}

export interface Trabajadoresxrrhh {
  acciontraxrrhh: number;
  codigounidadrrhh: string;
  runtrabajador: string;
}

interface Usuarioxrrhh {
  acccionusuxrrhh: number;
  codigounidadrrhh: string;
  runusuario: string;
  rolusuario: number;
}

export interface Unidadesrrhh {
  accionrrhh: number;
  codigounidadrrhh: string;
  glosaunidadrrhh: string;
  codigocomuna: string;
  codigoregion: string;
  codigotipocalle: number;
  direccion: string;
  numero: string;
  blockdepto: string;
  telefono: string;
}
