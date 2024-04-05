export interface CalidadPersonaTrabajadora {
  tipoempleador: Tipoempleador;
  calidadtrabajador: Calidadtrabajador;
}

interface Calidadtrabajador {
  idcalidadtrabajador: number;
  calidadtrabajador: string;
}

interface Tipoempleador {
  idtipoempleador: number;
  tipoempleador: string;
}
