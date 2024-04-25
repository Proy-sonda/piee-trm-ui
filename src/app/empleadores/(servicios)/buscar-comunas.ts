import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { Comuna } from '../(modelos)/comuna';

export const buscarComunas = () => {
  return runFetchAbortable<Comuna[]>(`${apiUrl()}/comuna/all/region`);
};
