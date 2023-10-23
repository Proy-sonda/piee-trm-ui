export interface LicenciaC1 {
  foliolicencia: string;
  operador: Operador;
  rutempleador: string;
  direccion: string;
  numero: string;
  depto: string;
  telefono: string;
  fecharecepcion: string;
  glosaotraocupacion: string;
  comuna: Comuna;
  tipocalle: Tipocalle;
  ocupacion: Ocupacion;
  actividadlaboral: Actividadlaboral;
}

interface Actividadlaboral {
  idactividadlaboral: number;
  actividadlaboral: string;
}

interface Ocupacion {
  idocupacion: number;
  ocupacion: string;
}

interface Tipocalle {
  idtipocalle: number;
  tipocalle: string;
}

interface Comuna {
  idcomuna: string;
  nombre: string;
}

interface Operador {
  idoperador: number;
  operador: string;
}
