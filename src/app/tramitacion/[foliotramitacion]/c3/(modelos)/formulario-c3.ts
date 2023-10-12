import { esFechaInvalida } from '@/utilidades';
import { DesgloseDeHaberes } from './desglose-de-haberes';

export interface FormularioC3 {
  tipoDocumento: string;
  remuneracionImponiblePrevisional: string;
  porcentajeDesahucio: number;
  remuneraciones: Remuneracion[];
  remuneracionesMaternidad: Remuneracion[];
}

export interface Remuneracion {
  prevision: number;
  periodoRenta: Date;
  dias: number;
  montoImponible: number;
  montoImponibleDesahucio: number;
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
    !isNaN(fila.montoImponibleDesahucio) ||
    tieneDesglose(fila.desgloseHaberes)
  );
};
