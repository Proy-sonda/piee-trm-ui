// TODO: Obtener el tipo de reposo
export interface LicenciaC0 {
  foliolicencia: string;
  operador: Operador;
  ruttrabajador: string;
  apellidopaterno: string;
  apellidomaterno: string;
  nombres: string;
  fechaemision: string;
  fechainicioreposo: string;
  fechatramitacion?: string;
  /** En formato `yyyy-MM-dd` */
  fechaestado: string;
  ndias: number;
  tipolicencia: Tipolicencia;
  estadolicencia: Estadolicencia;
  motivodevolucion: Motivodevolucion;
  estadotramitacion: Estadotramitacion;
  entidadsalud: Entidadsalud;
}

interface Entidadsalud {
  identidadsalud: number;
  nombre: string;
}
interface Estadolicencia {
  idestadolicencia: number;
  estadolicencia: string;
}

interface Estadotramitacion {
  idestadotramitacion: number;
  estadotramitacion: string;
}

interface Motivodevolucion {
  idmotivodevolucion: number;
  motivodevolucion: string;
}

interface Operador {
  idoperador: number;
  operador: string;
}

interface Tipolicencia {
  idtipolicencia: number;
  tipolicencia: string;
}
