import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { Comuna } from '../(modelos)/comuna';

export const buscarComunas = () => {
  return runFetchAbortable<Comuna[]>(`${urlBackendTramitacion()}/comuna/all/region`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
};
