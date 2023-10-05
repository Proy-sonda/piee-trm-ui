export interface Empleador {
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
}

export interface Actividadlaboral {
  idactividadlaboral: number;
  actividadlaboral: string;
}

export interface Ccaf {
  idccaf: number;
  nombre: string;
}

export interface Direccionempleador {
  calle: string;
  numero: string;
  depto: string;
  comuna: Comuna;
}

export interface Comuna {
  idcomuna: string;
  nombre: string;
  region: Region;
}

export interface Region {
  idregion: string;
  nombre: string;
}

export interface Sistemaremuneracion {
  idsistemaremuneracion: number;
  descripcion: string;
}

export interface Tamanoempresa {
  idtamanoempresa: number;
  nrotrabajadores: number;
  descripcion: string;
}

export interface Tipoempleador {
  idtipoempleador: number;
  tipoempleador: string;
}
