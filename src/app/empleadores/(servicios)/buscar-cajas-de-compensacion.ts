import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { CajaDeCompensacion } from '../(modelos)/caja-de-compensacion';

export const buscarCajasDeCompensacion = () => {
  return runFetchAbortable<CajaDeCompensacion[]>(`${apiUrl()}/ccaf/all`);
};
