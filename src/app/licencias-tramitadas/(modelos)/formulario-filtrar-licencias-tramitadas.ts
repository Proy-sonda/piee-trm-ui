import { IdUnidadComboUnidades } from '@/components';

export interface FormularioFiltrarLicenciasTramitadas {
  folio: string;
  runPersonaTrabajadora: string;
  idEstadoLicencia: number;
  idEstadoTramitacion: number;
  /** 1: Fecha Emisión | 2: Fecha Tramitación */
  tipoPeriodo: 1 | 2;
  fechaDesde: Date;
  fechaHasta: Date;
  rutEntidadEmpleadora: string;
  idUnidadRRHH: IdUnidadComboUnidades;
}

export interface FiltrosBuscarLicenciasTramitadas
  extends Partial<Omit<FormularioFiltrarLicenciasTramitadas, 'idUnidadRRHH'>> {
  unidadRRHH?: {
    codigoUnidad: string;
    idOperador: number;
  };
}

export const hayFiltrosLicenciasTramitadas = (filtros: FiltrosBuscarLicenciasTramitadas) => {
  return (
    filtros.folio !== undefined ||
    filtros.runPersonaTrabajadora !== undefined ||
    filtros.idEstadoLicencia !== undefined ||
    filtros.idEstadoTramitacion !== undefined ||
    filtros.fechaDesde !== undefined ||
    filtros.fechaHasta !== undefined ||
    filtros.rutEntidadEmpleadora !== undefined ||
    filtros.unidadRRHH !== undefined ||
    filtros.tipoPeriodo !== undefined
  );
};
