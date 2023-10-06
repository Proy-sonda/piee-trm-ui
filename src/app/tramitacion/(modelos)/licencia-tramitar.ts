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
  tiporesposo: Tiporesposo;
  entidadsalud: Entidadsalud;
}

interface Entidadsalud {
  identidadsalud: number;
  rut: string;
  nombre: string;
}

interface Tiporesposo {
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

export const esLicenciaMaternidad = (licencia: LicenciaTramitar) => {
  return licencia.tipolicencia.idtipolicencia === 3;
};
