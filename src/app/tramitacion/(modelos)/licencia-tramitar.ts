import { endOfDay, isAfter, isToday } from 'date-fns';

export interface LicenciaTramitar {
  foliolicencia: string;
  runtrabajador: string;
  nombres: string;
  apellidomaterno: string;
  apellidopaterno: string;
  diasreposo: number;
  fechaemision: string;
  fechainicioreposo: string;
  rutempleador: string;
  fechaestadolicencia: string;
  ccaf: Ccaf;
  estadolicencia: Estadolicencia;
  motivodevolucion: Motivodevolucion;
  operador: Operador;
  tipolicencia: Tipolicencia;
  jornadareposo: Jornadareposo;
  tiporeposo: Tiporeposo;
  entidadsalud: Entidadsalud;
  estadoTramitacion?: Estadotramitacion;
  fechaultdiatramita: Date;
  tramitacioniniciada?: boolean;
  rutusuariotramita: string | null | undefined;
}

interface Entidadsalud {
  identidadsalud: number;
  rut: string;
  nombre: string;
}

interface Tiporeposo {
  idtiporeposo: number;
  tiporeposo: string;
}

interface Jornadareposo {
  idjornadareposo: string;
  jornadareposo: string;
}

interface Tipolicencia {
  idtipolicencia: number;
  tipolicencia: string;
}

interface Operador {
  idoperador: number;
  operador: string;
}

interface Motivodevolucion {
  idmotivodevolucion: number;
  motivodevolucion: string;
}

interface Estadolicencia {
  idestadolicencia: number;
  estadolicencia: string;
}

interface Ccaf {
  idccaf: number;
  nombre: string;
}

interface Estadotramitacion {
  idestadotramitacion: number;
  estadotramitacion: string;
}

export const esLicenciaMaternidad = (licencia: LicenciaTramitar) => {
  return licencia.tipolicencia.idtipolicencia == 3;
};

export const esLicenciaFONASA = (licencia: LicenciaTramitar) => {
  return licencia.entidadsalud.identidadsalud == 1;
};

export const esLicenciaDiatDiep = (licencia: LicenciaTramitar) => {
  return [5, 6].includes(licencia.tipolicencia.idtipolicencia);
};

export const licenciaSePuedeTramitar = ({ estadoTramitacion }: LicenciaTramitar) => {
  return estadoTramitacion === undefined || estadoTramitacion.idestadotramitacion == 1;
};

export const licenciaEnviadaHaciaOperadores = ({ estadoTramitacion }: LicenciaTramitar) => {
  return estadoTramitacion !== undefined && estadoTramitacion.idestadotramitacion == 3;
};

export const licenciaFueDevuelta = ({ estadoTramitacion }: LicenciaTramitar) => {
  return estadoTramitacion !== undefined && estadoTramitacion.idestadotramitacion !== 6;
};

export const calcularPlazoVencimiento = (licencia: LicenciaTramitar) => {
  const fechaLicencia = new Date(licencia.fechaultdiatramita);

  // Validamos si la fecha de hoy es menor a la fechaultimodiatramite y si es el mismo día debe mostrar el circulo amarillo
  if (isAfter(fechaLicencia, endOfDay(Date.now()))) {
    return 'en-plazo';
  } else if (isToday(fechaLicencia)) {
    return 'por-vencer';
  } else {
    return 'vencida';
  }
};
