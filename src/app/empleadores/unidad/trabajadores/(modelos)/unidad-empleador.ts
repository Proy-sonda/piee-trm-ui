export interface UnidadEmpleador {
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
}

interface Estadounidadrrhh {
  idestadounidadrrhh: number;
  descripcion: string;
}
