import { esFechaInvalida } from '@/utilidades';

export interface FormularioC4 {
  accion: 'guardar' | 'tramitar' | 'anterior';
  informarLicencia: boolean;
  licenciasAnteriores: LicenciaAnterior[];
}

export interface LicenciaAnterior {
  dias: number;
  desde: Date;
  hasta: Date;
}

export const estaLicenciaAnteriorCompleta = ({ dias, desde, hasta }: LicenciaAnterior) => {
  return !isNaN(dias) && !esFechaInvalida(desde) && !esFechaInvalida(hasta);
};

export const licenciaAnteriorTieneCamposValidos = ({ dias, desde, hasta }: LicenciaAnterior) => {
  return !isNaN(dias) || !esFechaInvalida(desde) || !esFechaInvalida(hasta);
};
