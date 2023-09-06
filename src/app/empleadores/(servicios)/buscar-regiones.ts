import { runFetchAbortable } from '@/servicios/fetch';
import { Region } from '../(modelos)/region';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarRegiones = () => {
  return runFetchAbortable<Region[]>(`${apiUrl}Region/all`);
};
