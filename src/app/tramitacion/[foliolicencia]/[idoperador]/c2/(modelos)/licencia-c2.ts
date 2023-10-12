export interface Licenciac2 {
  foliolicencia: string;
  operador: Operador;
  fecharecepcionccaf: string;
  codigoletracaja: string;
  codigoseguroafc: number;
  codigocontratoindef: number;
  fechaafiliacion: string;
  fechacontrato: string;
  nombrepagador: string;
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
}

interface Calidadtrabajador {
  idcalidadtrabajador: number;
  calidadtrabajador: string;
}

interface Operador {
  idoperador: number;
  operador: string;
}
