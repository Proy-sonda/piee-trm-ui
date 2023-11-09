export interface EmpleadorPorId {
  idempleador: number;
  rutempleador: string;
  razonsocial: string;
  nombrefantasia: string;
  telefonohabitual: string;
  telefonomovil: string;
  email: string;
  holding: string;
  estadoempleador: Estadoempleador;
  direccionempleador: Direccionempleador;
  ccaf: Ccaf;
  tamanoempresa: Tamanoempresa;
  tipoempleador: Tipoempleador;
  sistemaremuneracion: Sistemaremuneracion;
  actividadlaboral: Actividadlaboral;
}

interface Actividadlaboral {
  idactividadlaboral: number;
  actividadlaboral: string;
}

interface Sistemaremuneracion {
  idsistemaremuneracion: number;
  descripcion: string;
}

interface Tipoempleador {
  idtipoempleador: number;
  tipoempleador: string;
}

interface Tamanoempresa {
  idtamanoempresa: number;
  nrotrabajadores: number;
  descripcion: string;
}

interface Ccaf {
  idccaf: number;
  nombre: string;
}

interface Direccionempleador {
  iddireccionempleador: number;
  calle: string;
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

interface Estadoempleador {
  idestadoempleador: number;
  estadoempleador: string;
}
