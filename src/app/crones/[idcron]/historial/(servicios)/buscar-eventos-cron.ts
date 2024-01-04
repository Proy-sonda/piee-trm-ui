import { urlBackendWorkers } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { ResultadoBusquedaEventosCron } from '../(modelos)';

export interface BuscarEventosCronRequest {
  idCron: number;
  paginacion: {
    pagina: number;
    tamanoPagina: number;
  };
}

export const buscarEventosCron = (request: BuscarEventosCronRequest) => {
  return runFetchAbortable<ResultadoBusquedaEventosCron>(`${urlBackendWorkers()}/crons/eventos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
};
