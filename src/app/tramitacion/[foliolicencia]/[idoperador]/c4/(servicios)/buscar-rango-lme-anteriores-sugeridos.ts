import { FetchAbortableResponse } from '@/servicios';
import { RangoLmeAnterioresSugerido } from '../(modelos)';
import {
  PeriodosRentasSugeridasAndRangoLmeAnterioresRequest,
  buscarRentasSugeridasAndRangoLmeAnteriores,
} from '../../(servicios)';

export const buscarRangoLmeAnterioresSugeridos = (
  request: PeriodosRentasSugeridasAndRangoLmeAnterioresRequest,
) => {
  const [requestPeriodos, abortador] = buscarRentasSugeridasAndRangoLmeAnteriores(request);

  const toRangoLmeSugerido = async () => {
    const rentasSugeridasAPI = await requestPeriodos();
    const [desde, hasta] = rentasSugeridasAPI.PeriodoLMEAnteriores.split('|');
    const rentasSugeridas: RangoLmeAnterioresSugerido = { desde, hasta };
    return rentasSugeridas;
  };

  return [toRangoLmeSugerido, abortador] as FetchAbortableResponse<RangoLmeAnterioresSugerido>;
};
