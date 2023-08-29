import { runFetch } from '@/servicios/fetch';
import { TamanoEmpresa } from '../(modelos)/tamano-empresa';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarTamanosEmpresa = async () => {
  return runFetch<TamanoEmpresa[]>(fetch(`${apiUrl}tamanoempresa/all`));
};
