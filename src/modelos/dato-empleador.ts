export interface DatoEmpleador {
  idempleador: number;
  rutempleador: string;
  razonsocial: string;
  nombrefantasia: string;
  telefonohabitual: string;
  telefonomovil: string;
  email: string;
  holding: string;
  tipoempleador: Tipoempleador;
  sistemaremuneracion: Sistemaremuneracion;
  tamanoempresa: Tamanoempresa;
  ccaf: Ccaf;
  actividadlaboral: Actividadlaboral;
  direccionempleador: Direccionempleador;
  usuarioempleador: Usuarioempleador;
}

interface Actividadlaboral {
  idactividadlaboral: number;
  actividadlaboral: string;
}

interface Ccaf {
  idccaf: number;
  nombre: string;
}

interface Direccionempleador {
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

interface Sistemaremuneracion {
  idsistemaremuneracion: number;
  descripcion: string;
}

interface Tamanoempresa {
  idtamanoempresa: number;
  nrotrabajadores: number;
  descripcion: string;
}

interface Tipoempleador {
  idtipoempleador: number;
  tipoempleador: string;
}

interface Usuarioempleador {}
