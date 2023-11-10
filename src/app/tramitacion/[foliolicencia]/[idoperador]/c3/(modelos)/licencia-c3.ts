import { DesgloseDeHaberes } from './desglose-de-haberes';

export interface LicenciaC3 {
  folioLicencia: string;
  operador: {
    idOperador: number;
    glosa: string;
  };
  remuneracionImponiblePrevisional: number;
  porcentajeDesahucio: number;
  rentas: RentaC3[];
  rentasMaternidad: RentaC3[];
}

export interface RentaC3 {
  /**
   * - `0`: Normal
   * - `1`: Maternal
   */
  tipoRenta: 0 | 1;

  /** Se fija la fecha al inicio del mes */
  periodo: Date;
  dias: number;
  montoImponible: number;
  totalRemuneracion: number;
  montoIncapacidad: number;
  diasIncapacidad: number;

  /**
   * El "ID" de la entidad previsional llenada con la función {@link idEntidadPrevisional} y que
   * luego deberia ser parseada con la funcion {@link parsearIdEntidadPrevisional}. Ambas funciones
   * en el modelo de la entidad previsional.
   */
  idPrevision: string;
  desgloseHaberes: DesgloseDeHaberes | Record<string, never>;
}
