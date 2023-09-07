import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { TamanoEmpresa } from '../(modelos)/tamano-empresa';

export const buscarTamanosEmpresa = () => {
  return runFetchAbortable<TamanoEmpresa[]>(`${apiUrl()}/tamanoempresa/all`);
};
