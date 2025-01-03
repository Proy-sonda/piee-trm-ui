export interface Licenciac2 {
  foliolicencia: string;
  operador: Operador;
  fecharecepcionccaf: string;
  codigoseguroafc: number;
  codigocontratoindef: number;
  fechaafiliacion: string;
  fechacontrato: string;
  nombrepagador?: string;
  calidadtrabajador: Calidadtrabajador;
  entidadprevisional: Entidadprevisional;
  entidadpagadora: Entidadpagadora;
}

interface Entidadpagadora {
  identidadpagadora: string;
  entidadpagadora: string;
}

interface Entidadprevisional {
  codigoentidadprevisional: number;
  codigoregimenprevisional: number;
  letraentidadprevisional: string;
  glosa?: string; // TODO: Deberian ser obligatorias
  codigosuceso?: number; // TODO: Deberian ser obligatorias
  vigente?: number; // TODO: Deberian ser obligatorias
}

interface Calidadtrabajador {
  idcalidadtrabajador: number;
  calidadtrabajador: string;
}

interface Operador {
  idoperador: number;
  operador: string;
}

export const esTrabajadorIndependiente = (licencia: Licenciac2) => {
  return licencia.calidadtrabajador.idcalidadtrabajador === 4;
};
