import { urlBackendWorkers } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { ConfiguracionCron } from '../(modelos)';

export const buscarCronPorId = (idCron: number) => {
  return runFetchAbortable<ConfiguracionCron>(`${urlBackendWorkers()}/crons/${idCron}`);
};
