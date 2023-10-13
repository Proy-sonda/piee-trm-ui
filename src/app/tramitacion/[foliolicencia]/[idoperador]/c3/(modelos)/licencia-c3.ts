import { DesgloseDeHaberes } from './desglose-de-haberes';

export interface LicenciaC3 {
  folioLicencia: string;
  operador: Operador;
  remuneracionImponiblePrevisional: number;
  porcentajeDesahucio: number;
  rentas: Renta[];
  rentasMaternidad: Renta[];
}

export interface Renta {
  /**
   * - `0`: Normal
   * - `1`: Maternal
   */
  tipoRenta: 0 | 1;

  /** Periodo en formato `yyyy-MM` */
  periodo: string;
  dias: number;
  montoImponible: number;
  totalRemuneraciones: number;
  montoIncapacidad: number;
  diasIncapacidad: number;
  idPrevision: number;
  desgloseHaberes: DesgloseDeHaberes | Record<string, never>;
}

export interface LicenciaC3Api {
  foliolicencia: string;
  operador: Operador;
  porcendesahucio: number;
  montoimponible: number;
  licenciazc3rentas: RentaApi[];
}

export interface RentaApi {
  tiporenta: number;
  periodorenta: number;
  nrodias: number;
  montoimponible: number;
  totalrem: number;
  montoincapacidad: number;
  ndiasincapacidad: number;
  prevision: Prevision;
  licenciazc3haberes: Haberes[];
}

interface Haberes {
  tipohaber: string;
  montohaber: number;
}

interface Prevision {
  idprevision: number;
}

interface Operador {
  idoperador: number;
  operador: string;
}
