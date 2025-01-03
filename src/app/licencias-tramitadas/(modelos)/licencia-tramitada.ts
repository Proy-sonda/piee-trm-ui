export interface LicenciaTramitada {
  foliolicencia: string;
  rutempleador: string;
  operador: Operador;
  ruttrabajador: string;
  apellidopaterno: string;
  apellidomaterno: string;
  nombres: string;
  fechaemision: string;
  fechainicioreposo: string;
  ndias: number;
  fechaestado: string;
  fechaterminorelacion: null;
  otromotivonorecepcion: string;
  licenciasanteriores: number;
  fechatramitacion: string;
  ruttramitacion: string;
  codigounidadrrhh: string;
  glosaunidadrrhh: string;
  fechaultdiatramita: string;
  tipolicencia: Tipolicencia;
  estadolicencia: Estadolicencia;
  entidadsalud: Entidadsalud;
  estadotramitacion: Estadotramitacion;
  motivodevolucion: Motivodevolucion;
  motivonorecepcion: Motivonorecepcion | null;
  ccaf: Ccaf;
  tiporeposo: Tiporeposo;
}

interface Ccaf {
  idccaf: number;
  nombre: string;
  seleccionable: number;
}

interface Entidadsalud {
  identidadsalud: number;
  rut: string;
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

interface Tiporeposo {
  idtiporeposo: number;
  tiporeposo: string;
}

interface Motivonorecepcion {
  idmotivonorecepcion: number;
  motivonorecepcion: string;
  solicitaentidadpag: number;
  solicitaadjunto: number;
}

export const esLicenciaNoTramitada = (licencia: LicenciaTramitada) => {
  return licencia.motivonorecepcion !== null;
};

export const licenciaFueTramitada = ({ estadotramitacion }: LicenciaTramitada) => {
  return [4].includes(estadotramitacion.idestadotramitacion);
} 

export const licenciaFueTramitadaPorOperador = ({ estadotramitacion }: LicenciaTramitada) => {
  return estadotramitacion.idestadotramitacion === 4;
};

