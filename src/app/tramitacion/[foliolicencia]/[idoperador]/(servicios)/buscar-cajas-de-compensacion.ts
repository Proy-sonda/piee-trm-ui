import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { CajaDeCompensacion } from '../(modelo)/caja-de-compensacion';

export const buscarCajasDeCompensacion = () => {
  return runFetchAbortable<CajaDeCompensacion[]>(`${urlBackendTramitacion()}/ccaf/all`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
};
