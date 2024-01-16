export interface DesgloseDeHaberes {
  sueldoBase: number;
  gratificacion: number;
  horasExtras: number;
  aguinaldos: number;
  bono1: number;
  bono2: number;
  bono3: number;
  bono4: number;
  bono5: number;
}

const mapaGlosas: Record<keyof DesgloseDeHaberes, string> = {
  sueldoBase: 'Sueldo Base',
  gratificacion: 'Gratificación',
  horasExtras: 'Horas Extras',
  aguinaldos: 'Aguinaldos',
  bono1: 'Bono 1',
  bono2: 'Bono 2',
  bono3: 'Bono 3',
  bono4: 'Bono 4',
  bono5: 'Bono 5',
};

// prettier-ignore
const mapaGlosasInverso: Record<string, keyof DesgloseDeHaberes> = {
  'Sueldo Base': 'sueldoBase',
  'Gratificación': 'gratificacion',
  'Horas Extras': 'horasExtras',
  'Aguinaldos': 'aguinaldos',
  'Bono 1': 'bono1',
  'Bono 2': 'bono2',
  'Bono 3': 'bono3',
  'Bono 4': 'bono4',
  'Bono 5': 'bono5',
};

export const obtenerGlosaDesglosaHaberes = (campo: keyof DesgloseDeHaberes) => mapaGlosas[campo];

export const desgloseFromGlosas = (xs: { tipohaber: string; montohaber: number }[]) => {
  const desglose: any = {};

  for (const { tipohaber, montohaber } of xs) {
    desglose[mapaGlosasInverso[tipohaber]] = montohaber;
  }

  return desglose as DesgloseDeHaberes;
};

// prettier-ignore
export const existeDesglose = (x: DesgloseDeHaberes | Record<string, never>): x is DesgloseDeHaberes => {
  return Object.values(x).length !== 0;
};

export const totalDesglose = (desglose: DesgloseDeHaberes): number => {
  return Object.values(desglose).reduce((total, monto) => total + monto, 0);
};
