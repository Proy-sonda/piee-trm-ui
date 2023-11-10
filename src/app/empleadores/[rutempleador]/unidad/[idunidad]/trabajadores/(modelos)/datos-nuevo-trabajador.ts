export interface DatosNuevoTrabajador {
  ruttrabajador: string;
  unidad: Unidad;
  fechaafiliacion?: Date;
  estadotrabajador?: Estadotrabajador;
}

interface Unidad {
  idunidad: number;
}

interface Estadotrabajador {
  idestadotrabajador: number;
}
