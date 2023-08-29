export interface UpdateUnidad {
  idunidad: number | undefined;
  unidad: string;
  identificador: string;
  email: string;
  telefono: string;
  direccionunidad: DireccionUnidad;
  estadounidadrrhh: EstadoUnidadRRHH;
  empleador: Empleador;
}

export interface DireccionUnidad {
  calle: string;
  numero: string;
  depto: string;
  comuna: Comuna;
}

export interface Comuna {
  idcomuna: string;
  nombre: string;
}

export interface Empleador {
  idempleador: number;
}

export interface EstadoUnidadRRHH {
  idestadounidadrrhh: number;
  descripcion: string;
}
