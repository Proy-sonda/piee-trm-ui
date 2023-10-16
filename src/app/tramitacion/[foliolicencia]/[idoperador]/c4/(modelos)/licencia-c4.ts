export interface LicenciaC4 {
  foliolicencia: string;
  operador: Operador;
  ruttrabajador: string;
  lmandias: number;

  /** En formato `yyyy-MM-dd */
  lmafechadesde: string;

  /** En formato `yyyy-MM-dd */
  lmafechahasta: string;
}

interface Operador {
  idoperador: number;
  operador: string;
}
