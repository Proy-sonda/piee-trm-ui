export interface Trabajadores {
  idtrabajador: number;
  fechaafiliacion: Date;
  ruttrabajador: string;
  unidad: Unidad;
  estadotrabajador: Estadotrabajador;
}

interface Estadotrabajador {
  idestadotrabajador: number;
  estadotrabajador: string;
}

interface Unidad {
  idunidad: number;
}
