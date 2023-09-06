import { runFetchAbortable } from '@/servicios/fetch';
import { TipoEmpleador } from '../(modelos)/tipo-empleador';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarTiposDeEmpleadores = () => {
  return runFetchAbortable<TipoEmpleador[]>(`${apiUrl}tipoempleador/all`);
};
