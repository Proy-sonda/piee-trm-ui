export interface EmpleadorUnidad {
  RutEmpleador: string;
  RunUsuario: string;
  unidadesrrhh?: Unidadesrrhh;
  usuarioxrrhh?: Usuarioxrrhh;
  trabajadoresxrrhh?: Trabajadoresxrrhh;
  operador?: number;
}

export interface Trabajadoresxrrhh {
  acciontraxrrhh: number;
  codigounidadrrhh: string;
  runtrabajador: string;
}

export interface Usuarioxrrhh {
  acccionusuxrrhh: number;
  codigounidadrrhh: string;
  runusuario: string;
  rolusuario: number;
}

export interface Unidadesrrhh {
  accionrrhh: number;
  CodigoUnidadRRHH: string;
  GlosaUnidadRRHH: string;
  CodigoRegion: string;
  CodigoComuna: string;
  CodigoTipoCalle: number;
  Direccion: string;
  Numero: string;
  BlockDepto: string;
  Telefono: string;
}
export interface ActualizaUnidadRRHH {
  AccionRRHH: number;
  CodigoUnidadRRHH: string;
  GlosaUnidadRRHH: string;
  CodigoRegion: number;
  CodigoComuna: number;
  CodigoTipoCalle: number;
  Direccion: string;
  BlockDepto: number;
  Telefono: number;
}
