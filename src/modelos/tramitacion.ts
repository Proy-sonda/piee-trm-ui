export interface Unidadrhh {
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

export interface ActualizaEmpleador {
  idempleador: number;
  rutempleador: string;
  razonsocial: string;
  nombrefantasia: string;
  telefonohabitual: string;
  telefonomovil: string;
  email: string;
  emailconfirma: string;
  tipoempleador: Tipoempleador;
  ccaf: Ccaf;
  actividadlaboral: Actividadlaboral;
  tamanoempresa: Tamanoempresa;
  sistemaremuneracion: Sistemaremuneracion;
  direccionempleador: Direccionempleador;
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
  comuna: Comuna2;
}

interface Comuna2 {
  idcomuna: string;
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
