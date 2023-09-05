import { runFetchAbortable } from '@/servicios/fetch';
import { CajaDeCompensacion } from '../(modelos)/caja-de-compensacion';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarCajasDeCompensacion = () => {
  return runFetchAbortable<CajaDeCompensacion[]>(`${apiUrl}ccaf/all`);
};
