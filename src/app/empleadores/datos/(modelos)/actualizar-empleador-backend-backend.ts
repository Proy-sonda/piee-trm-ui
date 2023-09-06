export interface ActualizarEmpleadorBackendRequest {
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

interface Direccionempleador {
  calle: string;
  numero: string;
  depto: string;
  comuna: Comuna;
}

interface Comuna {
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

interface Actividadlaboral {
  idactividadlaboral: number;
  actividadlaboral: string;
}

interface Ccaf {
  idccaf: number;
  nombre: string;
}

interface Tipoempleador {
  idtipoempleador: number;
  tipoempleador: string;
}
