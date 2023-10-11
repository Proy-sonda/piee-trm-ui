import { DesgloseDeHaberes } from './desglose-de-haberes';

export interface FormularioC3 {
  tipoDocumento: string;
  remuneracionImponiblePrevisional: string;
  porcentajeDesahucio: number;
  remuneraciones: Remuneracion[];
  remuneracionesMaternidad: Remuneracion[];
}

interface Remuneracion {
  prevision: number;
  periodoRenta: Date;
  dias: string;
  montoImponible: number;
  montoImponibleDesahucio: number;
  desgloseHaberes: DesgloseDeHaberes | Record<string, never>;
}

export const tieneDesglose = (
  x: DesgloseDeHaberes | Record<string, never>,
): x is DesgloseDeHaberes => {
  return Object.values(x).length !== 0;
};
