import { esFechaInvalida } from '@/utilidades';
import { DesgloseDeHaberes, existeDesglose } from './desglose-de-haberes';

export interface Remuneracion {
  /**
   * El "ID" de la entidad previsional llenada con la función {@link idEntidadPrevisional} y que
   * luego deberia ser parseada con la funcion {@link parsearIdEntidadPrevisional}. Ambas funciones
   * en el modelo de la entidad previsional.
   */
  prevision: string;
  periodoRenta: Date;
  dias: number;
  /** Ahora se llama "Imponible Desahucio" */
  montoImponible: number;
  totalRemuneracion: number;
  montoIncapacidad: number;
  diasIncapacidad: number;
  desgloseHaberes: DesgloseDeHaberes | Record<string, never>;
}

export const remuneracionEstaCompleta = (fila: Remuneracion) => {
  return (
    fila.prevision !== '' &&
    !esFechaInvalida(fila.periodoRenta) &&
    !isNaN(fila.dias) &&
    !(isNaN(fila.montoImponible) && isNaN(fila.totalRemuneracion))
  );
};

export const remuneracionTieneAlgunCampoValido = (fila: Remuneracion) => {
  return (
    fila.prevision !== '' ||
    !esFechaInvalida(fila.periodoRenta) ||
    !isNaN(fila.dias) ||
    !isNaN(fila.montoImponible) ||
    !isNaN(fila.totalRemuneracion) ||
    !isNaN(fila.montoIncapacidad) ||
    !isNaN(fila.diasIncapacidad) ||
    existeDesglose(fila.desgloseHaberes)
  );
};

export const limpiarRemuneracion = (remuneracion: Remuneracion): Remuneracion => {
  return {
    ...remuneracion,
    dias: isNaN(remuneracion.dias) ? 0 : remuneracion.dias,
    montoImponible: isNaN(remuneracion.montoImponible) ? 0 : remuneracion.montoImponible,
    totalRemuneracion: isNaN(remuneracion.totalRemuneracion) ? 0 : remuneracion.totalRemuneracion,
    montoIncapacidad: isNaN(remuneracion.montoIncapacidad) ? 0 : remuneracion.montoIncapacidad,
    diasIncapacidad: isNaN(remuneracion.diasIncapacidad) ? 0 : remuneracion.diasIncapacidad,
  };
};
