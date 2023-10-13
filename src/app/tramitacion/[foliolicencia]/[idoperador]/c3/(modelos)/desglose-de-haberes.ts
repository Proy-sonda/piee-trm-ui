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
  gratificacion: 'Gratificacion',
  horasExtras: 'Horas Extras',
  aguinaldos: 'Aguinaldos',
  bono1: 'Bono 1',
  bono2: 'Bono 2',
  bono3: 'Bono 3',
  bono4: 'Bono 4',
  bono5: 'Bono 5',
};

export const obtenerGlosaDesglosaHaberes = (field: keyof DesgloseDeHaberes) => mapaGlosas[field];
