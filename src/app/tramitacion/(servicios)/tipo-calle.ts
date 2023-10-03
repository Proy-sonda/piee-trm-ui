import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { tipoCalle } from '../(modelos)/tipo-calle';

export const buscarCalle = () => {
  return runFetchAbortable<tipoCalle[]>(`${urlBackendTramitacion()}/tipocalle/all`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
};
