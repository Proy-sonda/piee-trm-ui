import { runFetch } from '@/servicios/fetch';
import { Region } from '../(modelos)/region';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarRegiones = async () => {
  return runFetch<Region[]>(fetch(`${apiUrl}Region/all`));
};
