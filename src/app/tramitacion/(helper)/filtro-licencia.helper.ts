import { existe, strIncluye } from '@/utilidades';
import { isWithinInterval } from 'date-fns';
import { FiltroEstadoLicencia } from '../(componentes)';
import {
  calcularPlazoVencimiento,
  FiltroBusquedaLicencias,
  hayFiltros,
  LicenciaTramitar,
} from '../(modelos)';

export const licenciaCumpleFiltros = (
  filtros: FiltroBusquedaLicencias,
  filtroEstado: FiltroEstadoLicencia,
) => {
  return (licencia: LicenciaTramitar) => {
    const plazoVencimientoLicencia = calcularPlazoVencimiento(licencia);
    let coincideColor = false;
    if (filtroEstado === 'todos') {
      coincideColor = true;
    } else if (plazoVencimientoLicencia === 'en-plazo' && filtroEstado === 'por-tramitar') {
      coincideColor = true;
    } else if (plazoVencimientoLicencia === 'por-vencer' && filtroEstado === 'por-vencer') {
      coincideColor = true;
    } else if (plazoVencimientoLicencia === 'vencida' && filtroEstado === 'vencido') {
      coincideColor = true;
    } else {
      coincideColor = false;
    }

    if (!hayFiltros(filtros)) {
      return coincideColor;
    }

    const coincideFolio = strIncluye(licencia.foliolicencia, filtros.folio);
    const coincideRun = strIncluye(licencia.runtrabajador, filtros.runPersonaTrabajadora);

    let coincideUnidadRRHH = true;
    if (existe(licencia.codigounidadrrhh) && existe(filtros.idUnidadRRHH)) {
      const [codigoUnidad, codigoOperador] = filtros.idUnidadRRHH.split('|');
      coincideUnidadRRHH =
        strIncluye(licencia.codigounidadrrhh, codigoUnidad) &&
        licencia.operador.idoperador === parseInt(codigoOperador, 10);
    }

    let enRangoFechas = true;
    if (filtros.fechaDesde && filtros.fechaHasta) {
      enRangoFechas = isWithinInterval(new Date(licencia.fechaemision), {
        start: filtros.fechaDesde,
        end: filtros.fechaHasta,
      });
    }

    const coincideEntidadEmpleadora = strIncluye(
      licencia.rutempleador,
      filtros.rutEntidadEmpleadora,
    );

    const coincideTipoLicencia = !filtros.tipolicencia
      ? true
      : licencia.tipolicencia.idtipolicencia === filtros.tipolicencia;

    return (
      coincideFolio &&
      coincideRun &&
      coincideUnidadRRHH &&
      enRangoFechas &&
      coincideEntidadEmpleadora &&
      coincideColor &&
      coincideTipoLicencia
    );
  };
};
