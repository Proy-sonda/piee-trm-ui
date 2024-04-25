import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { Region } from '../(modelos)/region';

export const buscarRegiones = () => {
  return runFetchAbortable<Region[]>(`${apiUrl()}/Region/all`);
};
