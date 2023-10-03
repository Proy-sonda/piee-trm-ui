import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { Region } from '../(modelos)/region';

export const buscarRegiones = () => {
  return runFetchAbortable<Region[]>(`${urlBackendTramitacion()}/Region/all`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
};
