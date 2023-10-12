import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { TipoEmpleador } from '../(modelos)/tipo-empleador';

export const buscarTiposDeEmpleadores = () => {
  return runFetchAbortable<TipoEmpleador[]>(`${apiUrl()}/tipoempleador/all`);
};
