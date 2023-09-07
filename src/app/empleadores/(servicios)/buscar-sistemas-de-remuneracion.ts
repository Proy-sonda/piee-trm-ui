import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { SistemaDeRemuneracion } from '../(modelos)/sistema-de-remuneracion';

export const buscarSistemasDeRemuneracion = () => {
  return runFetchAbortable<SistemaDeRemuneracion[]>(`${apiUrl()}/sistemaremuneracion/all`);
};
