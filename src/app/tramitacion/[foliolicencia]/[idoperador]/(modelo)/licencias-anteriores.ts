export interface LicenciasAnteriores {
  foliolicencia: string;
  operador: Operador;
  ruttrabajador: string;
  apellidopaterno: string;
  apellidomaterno: string;
  nombres: string;
  fechaemision: string;
  fechainicioreposo: string;
  ndias: number;
  fechaestado: string;
  fechaterminorelacion: string;
  otromotivonorecepcion: string;
  licenciasanteriores: number;
  fechatramitacion?: any;
  ruttramitacion: string;
  tipolicencia: Tipolicencia;
  estadolicencia: Estadolicencia;
  estadotramitacion: Estadotramitacion;
  licenciazc1: Licenciazc1[];
  licenciazc2: Licenciazc2[];
  licenciazc4: LicenciaAnteriorZC4[];
}

interface Licenciazc2 {
  foliolicencia: string;
  operador: number;
  fecharecepcionccaf: string;
  codigoseguroafc: number;
  codigocontratoindef: number;
  fechaafiliacion: string;
  fechacontrato: string;
  nombrepagador: string;
  entidadprevisional: Entidadprevisional;
  calidadtrabajador: Calidadtrabajador;
  entidadpagadora: Entidadpagadora;
}

interface Entidadpagadora {
  identidadpagadora: string;
  entidadpagadora: string;
}

interface Calidadtrabajador {
  idcalidadtrabajador: number;
  calidadtrabajador: string;
}

interface Entidadprevisional {
  codigoentidadprevisional: number;
  codigoregimenprevisional: number;
  letraentidadprevisional: string;
  glosa: string;
  codigosuseso: number;
  vigente: number;
}

interface Licenciazc1 {
  foliolicencia: string;
  operador: number;
  rutempleador: string;
  direccion: string;
  numero: string;
  depto: string;
  telefono: string;
  fecharecepcion: string;
  glosaotraocupacion: string;
  ocupacion: Ocupacion;
  comuna: Comuna;
  tipocalle: Tipocalle;
  actividadlaboral: Actividadlaboral;
}

interface Actividadlaboral {
  idactividadlaboral: number;
  actividadlaboral: string;
}

interface Tipocalle {
  idtipocalle: number;
  tipocalle: string;
}

interface Comuna {
  idcomuna: string;
  nombre: string;
}

interface Ocupacion {
  idocupacion: number;
  ocupacion: string;
}

interface Estadotramitacion {
  idestadotramitacion: number;
  estadotramitacion: string;
}

interface Estadolicencia {
  idestadolicencia: number;
  estadolicencia: string;
}

interface Tipolicencia {
  idtipolicencia: number;
  tipolicencia: string;
}

interface Operador {
  idoperador: number;
  operador: string;
}

export interface LicenciaAnteriorZC4 {
  foliolicencia: string;
  operador: number;
  correlativo: number;
  lmandias: number;

  /**
   * En formato ISO 8601
   * @example 2023-03-03T03:00:00.000Z
   */
  lmafechadesde: string;

  /**
   * En formato ISO 8601
   * @example 2023-03-04T03:00:00.000Z
   */
  lmafechahasta: string;
}
