import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { EntidadPagadora } from '../(modelos)/entidad-pagadora';

export const buscarEntidadPagadora = () => {
  return runFetchAbortable<EntidadPagadora[]>(`${urlBackendTramitacion()}/entidadpagadora/all`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
};
