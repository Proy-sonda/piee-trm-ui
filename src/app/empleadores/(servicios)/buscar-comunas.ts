import { runFetchAbortable } from '@/servicios/fetch';
import { Comuna } from '../(modelos)/comuna';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarComunas = () => {
  return runFetchAbortable<Comuna[]>(`${apiUrl}comuna/all/region`);
};
