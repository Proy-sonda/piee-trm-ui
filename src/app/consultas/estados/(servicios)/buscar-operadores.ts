import { runFetchAbortable, urlBackendTramitacion } from '@/servicios';
import { Operador } from '../(modelos)';

export const buscarOperadores = () => {
  return runFetchAbortable<Operador[]>(`${urlBackendTramitacion()}/operador/all`);
};
