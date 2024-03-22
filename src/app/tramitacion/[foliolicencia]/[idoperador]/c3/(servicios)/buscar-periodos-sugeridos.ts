import { FetchAbortableResponse } from '@/servicios';
import { PeriodosSugeridos } from '../(modelos)';
import {
  PeriodosRentasSugeridasAndRangoLmeAnterioresRequest,
  buscarRentasSugeridasAndRangoLmeAnteriores,
} from '../../(servicios)';

export const buscarPeriodosSugeridos = (
  request: PeriodosRentasSugeridasAndRangoLmeAnterioresRequest,
) => {
  const [requestRentas, abortador] = buscarRentasSugeridasAndRangoLmeAnteriores(request);

  const toModeloRentasSugeridas = async () => {
    const rentasSugeridasAPI = await requestRentas();

    const [desdeNormal, hastaNormal] = rentasSugeridasAPI.PeriodoRentasNormales.split('|');
    const rangoMaternal =
      rentasSugeridasAPI.PeriodoRentasMaternales === ''
        ? undefined
        : rentasSugeridasAPI.PeriodoRentasMaternales.split('|');

    const rentasSugeridas: PeriodosSugeridos = {
      fechaInicio: rentasSugeridasAPI.FechaInicioLME,
      rangoRentasNormales: { desde: desdeNormal, hasta: hastaNormal },
      periodosSugeridosNormales: rentasSugeridasAPI.RentasSugeridasGrilla.split('|'),
      rangoRentasMaternales: !rangoMaternal
        ? undefined
        : { desde: rangoMaternal[0], hasta: rangoMaternal[1] },
      periodosSugeridosMaternales:
        rentasSugeridasAPI.RentasMaternalesGrilla === ''
          ? undefined
          : rentasSugeridasAPI.RentasMaternalesGrilla.split('|'),
    };

    return rentasSugeridas;
  };

  return [toModeloRentasSugeridas, abortador] as FetchAbortableResponse<PeriodosSugeridos>;
};
