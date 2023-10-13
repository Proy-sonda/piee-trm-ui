import { esFechaInvalida } from '@/utilidades';
import { DesgloseDeHaberes } from './desglose-de-haberes';

export interface FormularioC3 {
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
