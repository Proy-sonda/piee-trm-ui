import { urlBackendWorkers } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { ConfiguracionCron } from '../(modelos)';

export const buscarCrones = () => {
  return runFetchAbortable<ConfiguracionCron[]>(`${urlBackendWorkers()}/crons`);
};
