export interface LicenciaTramitada {
  foliolicencia: string;
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
  estadolicencia: Estadolicencia;
  entidadsalud: Entidadsalud;
  tipolicencia: Tipolicencia;
  tiporeposo: Tiporeposo;
  estadotramitacion: Estadotramitacion;
  rutempleador: string;
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

export const licenciaFueTramitadaPorEmpleador = ({ estadotramitacion }: LicenciaTramitada) => {
  return [24, 25].includes(estadotramitacion.idestadotramitacion);
};

export const licenciaFueEnviadaAlOperador = ({ estadotramitacion }: LicenciaTramitada) => {
  return [34, 35].includes(estadotramitacion.idestadotramitacion);
};

export const licenciaFueTramitadaPorOperador = ({ estadotramitacion }: LicenciaTramitada) => {
  return estadotramitacion.idestadotramitacion === 4;
};

export const licenciaConErrorDeEnvio = ({ estadotramitacion }: LicenciaTramitada) => {
  return [241, 251].includes(estadotramitacion.idestadotramitacion);
};
