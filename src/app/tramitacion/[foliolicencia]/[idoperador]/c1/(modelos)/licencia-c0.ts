import { EntidadPagadora } from '../../c2/(modelos)';

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
  motivonorecepcion?: motivonorecepcion;
  /** En formato `yyyy-MM-dd` */
  fechaestado: string;
  ndias: number;
  tipolicencia: Tipolicencia;
  estadolicencia: Estadolicencia;
  motivodevolucion: Motivodevolucion;
  estadotramitacion: Estadotramitacion;
  entidadsalud: Entidadsalud;
  entidadpagadora?: EntidadPagadora;
  ccaf?: ccaf;
  tiporeposo: Tiporeposo;
  /** Es un string vacio para las licencias en las que no se alcanzo a guardar el RUT */
  ruttramitacion: string;
  fechaultdiatramita?: string;
  rutempleador: string;
}

interface motivonorecepcion {
  idmotivonorecepcion: number;
  motivonorecepcion: string;
  solicitaentidadpag?: number;
  solicitaadjunto?: number;
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

interface ccaf {
  idccaf: number;
  nombre: string;
}

interface Tiporeposo {
  idtiporeposo: number;
  tiporeposo: string;
}

export const licenciaCompletoTramitacion = (zona0: LicenciaC0) => {
  return zona0.estadotramitacion.idestadotramitacion !== 1;
};
