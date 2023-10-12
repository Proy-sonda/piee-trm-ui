export interface LicenciaC0 {
  foliolicencia: string;
  operador: Operador;
  ruttrabajador: string;
  apellidopaterno: string;
  apellidomaterno: string;
  nombres: string;
  fechaemision: string;
  fechainicioreposo: string;
  ndias: number;
  tipolicencia: Tipolicencia;
  estadolicencia: Estadolicencia;
  motivodevolucion: Motivodevolucion;
  estadotramitacion: Estadotramitacion;
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
