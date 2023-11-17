import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { TipoDocumento } from '../(modelo)/documento';

export const BuscarTipoDocumento = () => {
  return runFetchAbortable<TipoDocumento[]>(`${urlBackendTramitacion()}/tipoadjunto/all`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
};
