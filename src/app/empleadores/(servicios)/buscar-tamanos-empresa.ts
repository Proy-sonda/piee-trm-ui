import { runFetchAbortable } from '@/servicios/fetch';
import { TamanoEmpresa } from '../(modelos)/tamano-empresa';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarTamanosEmpresa = () => {
  return runFetchAbortable<TamanoEmpresa[]>(`${apiUrl}tamanoempresa/all`);
};
