import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { TipoCalle } from '../(modelos)/tipo-calle';

export const buscarTiposCalle = () => {
  return runFetchAbortable<TipoCalle[]>(`${apiUrl()}/tipocalle/all`);
};
