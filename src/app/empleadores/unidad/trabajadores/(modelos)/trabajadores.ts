export interface Trabajadores {
  idtrabajador: number;
  fechaafiliacion: Date;
  ruttrabajador: string;
  unidad: Unidad;
  estadotrabajador: Estadotrabajador;
}

export interface Estadotrabajador {
  idestadotrabajador: number;
  estadotrabajador: string;
}

export interface Unidad {
  idunidad: number;
}

export interface Trabajador {
  idtrabajador: number;
  unidad: Unidad;
}

export interface Unidad {
  idunidad: number;
}

export interface AgregarTrabajador {
  ruttrabajador: string;
  unidad: Unidad;
  fechaafiliacion?: Date;
  estadotrabajador?: Estadotrabajador;
}

export interface Estadotrabajador {
  idestadotrabajador: number;
}
