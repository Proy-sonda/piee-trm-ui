export interface DatosInscribirEmpleador {
  rutempleador: string;
  razonsocial: string;
  telefonohabitual: string;
  telefonomovil: string;
  email: string;
  emailconfirma: string;
  tipoempleador: TipoEmpleador;
  ccaf: CajasDeCompensacion;
  actividadlaboral: ActividadLaboral;
  tamanoempresa: TamanoEmpresa;
  sistemaremuneracion: SistemaDeRemuneracion;
  direccionempleador: DireccionEmpleador;
}

export interface ActividadLaboral {
  idactividadlaboral: number;
  actividadlaboral: string;
}

export interface CajasDeCompensacion {
  idccaf: number;
  nombre: string;
}

export interface DireccionEmpleador {
  calle: string;
  numero: string;
  depto: string;
  comuna: Comuna;
}

export interface Comuna {
  idcomuna: string;
  nombre: string;
}

export interface SistemaDeRemuneracion {
  idsistemaremuneracion: number;
  descripcion: string;
}

export interface TamanoEmpresa {
  idtamanoempresa: number;
  nrotrabajadores: number;
  descripcion: string;
}

export interface TipoEmpleador {
  idtipoempleador: number;
  tipoempleador: string;
}
