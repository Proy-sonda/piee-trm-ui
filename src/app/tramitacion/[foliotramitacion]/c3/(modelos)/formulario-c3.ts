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
  periodoRenta: string;
  dias: string;
  montoImponible: number;
  montoImponibleDesahucio: number;
  desgloseHaberes: DesgloseDeHaberes;
}
