import { runFetch } from '@/servicios/fetch';
import { Comuna } from '../(modelos)/comuna';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarComunas = async () => {
  return runFetch<Comuna[]>(fetch(`${apiUrl}comuna/all/region`));
};
