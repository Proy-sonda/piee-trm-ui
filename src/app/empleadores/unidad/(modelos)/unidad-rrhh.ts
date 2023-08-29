export interface UnidadRRHH {
  idunidad: number;
  unidad: string;
  identificador: string;
  email: string;
  telefono: string;
  empleador: Empleador;
  estadounidadrrhh: Estadounidadrrhh;
  direccionunidad: Direccionunidad;
}

interface Direccionunidad {
  iddireccionunidad: number;
  numero: string;
  depto: string;
  comuna: Comuna;
}

interface Comuna {
  idcomuna: string;
  nombre: string;
  region: Region;
}

interface Region {
  idregion: string;
  nombre: string;
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
  usuarioempleador: Usuarioempleador;
}

interface Usuarioempleador {}

interface Estadounidadrrhh {
  idestadounidadrrhh: number;
  descripcion: string;
}
