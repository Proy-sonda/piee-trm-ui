export interface LicenciaHistorica {
  operador: Operador;
  foliolicencia: string;
  rutempleador: string;
  codigounidadRRHH: string;
  runtrabajador: string;
  apellidopaterno: string;
  apellidomaterno: string;
  nombres: string;
  tiporeposo: Tiporeposo;
  jornadareposoparcial: string;
  fechaemision: string;
  fechainicioreposo: string;
  diasreposo: number;
  tipolicencia: Tipolicencia;
  estadolicencia: Estadolicencia;
  fechaestadolicencia: string;
}

interface Estadolicencia {
  idestadolicencia: number;
  estadolicencia: string;
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
