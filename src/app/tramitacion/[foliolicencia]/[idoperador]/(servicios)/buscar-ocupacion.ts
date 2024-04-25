import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { ocupacion } from '../(modelo)/ocupacion';

export const buscarOcupacion = () => {
  return runFetchAbortable<ocupacion[]>(`${urlBackendTramitacion()}/ocupacion/all`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
};
