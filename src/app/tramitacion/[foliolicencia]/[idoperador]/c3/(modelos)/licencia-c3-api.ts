export interface LicenciaC3API {
  foliolicencia: string;
  operador: OperadorAPI;
  porcendesahucio: number;
  montoimponible: number;
  licenciazc3rentas: RentaAPI[];
}

export interface RentaAPI {
  tiporenta: number;
  periodorenta: number;
  nrodias: number;
  montoimponible: number;
  totalrem: number;
  montoincapacidad: number;
  ndiasincapacidad: number;
  entidadprevisional: EntidadPrevisionalAPI;
  licenciazc3haberes: HaberesAPI[];
}

interface EntidadPrevisionalAPI {
  codigoentidadprevisional: number;
  codigoregimenprevisional: number;
  letraentidadprevisional: string;
}

interface HaberesAPI {
  tipohaber: string;
  montohaber: number;
}

interface OperadorAPI {
  idoperador: number;
  operador: string;
}
