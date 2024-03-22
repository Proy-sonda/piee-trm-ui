export interface PeriodosSugeridos {
  /** En formato `yyyy-MM-dd` */
  fechaInicio: string;

  rangoRentasNormales: {
    /** Fecha en formato `yyyy-MM-dd` */
    desde: string;

    /** Fecha en formato `yyyy-MM-dd` */
    hasta: string;
  };

  /** Arreglo de fechas en formato `yyyy-MM` ordenados del mas reciente al mas antiguo. */
  periodosSugeridosNormales: string[];

  rangoRentasMaternales?: {
    /** Fecha en formato `yyyy-MM-dd` */
    desde: string;

    /** Fecha en formato `yyyy-MM-dd` */
    hasta: string;
  };

  /** Arreglo de fechas en formato `yyyy-MM` ordenados del mas reciente al mas antiguo. */
  periodosSugeridosMaternales?: string[];
}
