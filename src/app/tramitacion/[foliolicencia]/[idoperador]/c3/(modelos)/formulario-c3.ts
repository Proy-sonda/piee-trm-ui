import { esFechaInvalida } from '@/utilidades';
import { DesgloseDeHaberes } from './desglose-de-haberes';

export interface FormularioC3 {
  accion: 'siguiente' | 'guardar' | 'anterior' | 'navegar';
  linkNavegacion: string;
  tipoDocumento: string;
  remuneracionImponiblePrevisional: number;
  porcentajeDesahucio: number;
  remuneraciones: Remuneracion[];
  remuneracionesMaternidad: Remuneracion[];
}

export interface Remuneracion {
  /**
   * El "ID" de la entidad previsional llenada con la función {@link idEntidadPrevisional} y que
   * luego deberia ser parseada con la funcion {@link parsearIdEntidadPrevisional}. Ambas funciones
   * en el modelo de la entidad previsional.
   */
  prevision: string;
  periodoRenta: Date;
  dias: number;
  montoImponible: number;
  totalRemuneracion: number;
  montoIncapacidad: number;
  diasIncapacidad: number;
  desgloseHaberes: DesgloseDeHaberes | Record<string, never>;
}

export const tieneDesglose = (
  x: DesgloseDeHaberes | Record<string, never>,
): x is DesgloseDeHaberes => {
  return Object.values(x).length !== 0;
};

export const estaRemuneracionCompleta = (fila: Remuneracion) => {
  return (
    fila.prevision !== '' &&
    !esFechaInvalida(fila.periodoRenta) &&
    !isNaN(fila.dias) &&
    !isNaN(fila.montoImponible)
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
    tieneDesglose(fila.desgloseHaberes)
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
