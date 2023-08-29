export interface Welcome {
  empleador: Empleador;
  administrador: Administrador;
}

export interface Administrador {
  rut: string;
  nombres: string;
  apellidos: string;
  email: string;
  emailconfirma: string;
  seriecedula: string;
  terminos: boolean;
}

export interface Empleador {
  rutempleador: string;
  razonsocial: string;
  telefonohabitual: string;
  telefonomovil: string;
  email: string;
  emailconfirma: string;
  tipoempleador: Tipoempleador;
  ccaf: Ccaf;
  actividadlaboral: Actividadlaboral;
  tamanoempresa: Tamanoempresa;
  sistemaremuneracion: Sistemaremuneracion;
  direccionempleador: DireccionEmpleador;
}

export interface DireccionEmpleador {
  calle: string;
  numero: string;
  depto: string;
  comuna: Comuna;
}

export interface Actividadlaboral {
  idactividadlaboral: number;
  actividadlaboral: string;
}

export interface Ccaf {
  idccaf: number;
  nombre: string;
}

export interface Comuna {
  idcomuna: string;
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

export type user = {
  rutusuario: string;
  nombres: string;
  apellidos: string;
  email: string;
};

export type errorInput = {
  input: string;
  msg: string;
};

export type respLogin = {
  error?: string;
  message: string;
  statusCode: number;
  data?: [];
};
