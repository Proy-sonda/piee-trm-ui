export interface RelacionCalidadDocumentoAdjunto {
  idrelacionadjuntos?: number;
  tipoadjunto: Tipoadjunto;
  calidadtrabajador: Calidadtrabajador;
  tipolicencia: Tipolicencia;
}

interface Tipolicencia {
  idtipolicencia: number;
  tipolicencia: string;
}

interface Calidadtrabajador {
  idcalidadtrabajador: number;
  calidadtrabajador: string;
}

interface Tipoadjunto {
  idtipoadjunto: number;
  tipoadjunto: string;
}
