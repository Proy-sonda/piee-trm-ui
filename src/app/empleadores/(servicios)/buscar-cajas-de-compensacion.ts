import { runFetch } from '@/servicios/fetch';
import { CajaDeCompensacion } from '../(modelos)/caja-de-compensacion';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarCajasDeCompensacion = async () => {
  return runFetch<CajaDeCompensacion[]>(fetch(`${apiUrl}ccaf/all`));
};
