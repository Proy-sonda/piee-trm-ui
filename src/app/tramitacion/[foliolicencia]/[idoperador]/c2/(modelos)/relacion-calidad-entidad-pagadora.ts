export interface RelacionLicenciaEntidadPagadora {
  idrelacion?: number;
  calidadtrabajador?: Calidadtrabajador;
  tipolicencia?: Tipolicencia;
  entidadpagadora: Entidadpagadora;
}

interface Entidadpagadora {
  identidadpagadora: string;
  entidadpagadora: string;
}

interface Tipolicencia {
  idtipolicencia: number;
  tipolicencia: string;
}

interface Calidadtrabajador {
  idcalidadtrabajador: number;
  calidadtrabajador: string;
}
