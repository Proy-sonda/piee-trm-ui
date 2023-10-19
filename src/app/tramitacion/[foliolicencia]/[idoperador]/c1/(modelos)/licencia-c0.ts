export interface LicenciaC0 {
  foliolicencia: string;
  operador: Operador;
  ruttrabajador: string;
  apellidopaterno: string;
  apellidomaterno: string;
  nombres: string;
  fechaemision: string;
  fechainicioreposo: string;

  /** En formato `yyyy-MM-dd` */
  fechaestado: string;
  ndias: number;
  tipolicencia: Tipolicencia;
  estadolicencia: Estadolicencia;
  motivodevolucion: Motivodevolucion;
  estadotramitacion: Estadotramitacion;
  entidadsalud: Entidadsalud;
}

export interface Entidadsalud {
  identidadsalud: number;
  nombre: string;
}
export interface Estadolicencia {
  idestadolicencia: number;
  estadolicencia: string;
}

export interface Estadotramitacion {
  idestadotramitacion: number;
  estadotramitacion: string;
}

export interface Motivodevolucion {
  idmotivodevolucion: number;
  motivodevolucion: string;
}

export interface Operador {
  idoperador: number;
  operador: string;
}

export interface Tipolicencia {
  idtipolicencia: number;
  tipolicencia: string;
}
