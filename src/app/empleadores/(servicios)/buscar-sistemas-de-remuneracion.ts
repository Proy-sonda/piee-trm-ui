import { runFetchAbortable } from '@/servicios/fetch';
import { SistemaDeRemuneracion } from '../(modelos)/sistema-de-remuneracion';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarSistemasDeRemuneracion = () => {
  return runFetchAbortable<SistemaDeRemuneracion[]>(`${apiUrl}sistemaremuneracion/all`);
};
