export interface CrearUnidad {
  unidad: string;
  identificador: string;
  email: string;
  telefono: string;
  direccionunidad: DireccionUnidad;
  estadounidadrrhh: EstadoUnidadRRHH;
  empleador: Empleador;
}

interface DireccionUnidad {
  calle: string;
  numero: string;
  depto: string;
  comuna: Comuna;
}

interface Comuna {
  idcomuna: string;
  nombre: string;
}

interface Empleador {
  idempleador: number;
}

interface EstadoUnidadRRHH {
  idestadounidadrrhh: number;
  descripcion: string;
}
