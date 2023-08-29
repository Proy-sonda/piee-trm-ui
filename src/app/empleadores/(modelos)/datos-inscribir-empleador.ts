export interface DatosInscribirEmpleador {
  rutempleador: string;
  razonsocial: string;
  telefonohabitual: string;
  telefonomovil: string;
  email: string;
  emailconfirma: string;
  tipoempleador: TipoEmpleador;
  ccaf: CajaDeCompensacion;
  actividadlaboral: ActividadLaboral;
  tamanoempresa: TamanoEmpresa;
  sistemaremuneracion: SistemaDeRemuneracion;
  direccionempleador: DireccionEmpleador;
}

interface ActividadLaboral {
  idactividadlaboral: number;
  actividadlaboral: string;
}

interface CajaDeCompensacion {
  idccaf: number;
  nombre: string;
}

interface DireccionEmpleador {
  calle: string;
  numero: string;
  depto: string;
  comuna: Comuna;
}

interface Comuna {
  idcomuna: string;
  nombre: string;
}

interface SistemaDeRemuneracion {
  idsistemaremuneracion: number;
  descripcion: string;
}

interface TamanoEmpresa {
  idtamanoempresa: number;
  nrotrabajadores: number;
  descripcion: string;
}

interface TipoEmpleador {
  idtipoempleador: number;
  tipoempleador: string;
}
