export interface RentasSugeridasAndRangoLmeAnterioresAPI {
  /** En formato `yyyy-MM-dd` */
  FechaInicioLME: string;

  /**
   * Un string en formato `yyyy-MM-dd|yyyy-MM-dd` donde la primera es la minima fecha para las
   * rentas y la segunda la maxima.
   */
  PeriodoRentasNormales: string;

  /**
   * Un string en formato `yyyy-MM|yyyy-MM|...` con los periodos sugeridos. Los periodos vienen
   * ordenados del mas reciente al mas antiguo.
   */
  RentasSugeridasGrilla: string;

  /**
   * Un string en formato `yyyy-MM-dd|yyyy-MM-dd` donde la primera es la minima fecha para las
   * rentas y la segunda la maxima.
   *
   * @warn Cuando la licencia no es maternal viene un string vacio.
   */
  PeriodoRentasMaternales: string;

  /**
   * Un string en formato `yyyy-MM|yyyy-MM|...` con los periodos sugeridos. Los periodos vienen
   * ordenados del mas reciente al mas antiguo.
   *
   * @warn Cuando la licencia no es maternal viene un string vacio.
   */
  RentasMaternalesGrilla: string;

  /**
   * Un string en formato `yyyy-MM-dd|yyyy-MM-dd` donde la primera es la minima fecha para las
   * rentas y la segunda la maxima.
   */
  PeriodoLMEAnteriores: string;
}
