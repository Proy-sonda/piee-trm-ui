import { strIncluye } from "@/utilidades";
import { FiltroEstadoLicencia } from "../(componentes)";
import { calcularPlazoVencimiento, FiltroBusquedaLicencias, hayFiltros, LicenciaTramitar } from "../(modelos)";
import { isWithinInterval } from "date-fns";

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

      return (
        coincideFolio && coincideRun && enRangoFechas && coincideEntidadEmpleadora && coincideColor
      );
    };
  };