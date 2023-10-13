import { esFechaInvalida } from '@/utilidades';
import { DesgloseDeHaberes } from './desglose-de-haberes';

export interface FormularioC3 {
  accion: 'siguiente' | 'guardar';
  tipoDocumento: string;
  remuneracionImponiblePrevisional: number;
  porcentajeDesahucio: number;
  remuneraciones: Remuneracion[];
  remuneracionesMaternidad: Remuneracion[];
}

export interface Remuneracion {
  prevision: number;
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
    !isNaN(fila.prevision) &&
    !esFechaInvalida(fila.periodoRenta) &&
    !isNaN(fila.dias) &&
    !isNaN(fila.montoImponible)
  );
};

export const remuneracionTieneAlgunCampoValido = (fila: Remuneracion) => {
  return (
    !isNaN(fila.prevision) ||
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
    prevision: isNaN(remuneracion.prevision) ? 0 : remuneracion.prevision,
    dias: isNaN(remuneracion.dias) ? 0 : remuneracion.dias,
    montoImponible: isNaN(remuneracion.montoImponible) ? 0 : remuneracion.montoImponible,
    totalRemuneracion: isNaN(remuneracion.totalRemuneracion) ? 0 : remuneracion.totalRemuneracion,
    montoIncapacidad: isNaN(remuneracion.montoIncapacidad) ? 0 : remuneracion.montoIncapacidad,
    diasIncapacidad: isNaN(remuneracion.diasIncapacidad) ? 0 : remuneracion.diasIncapacidad,
  };
};
