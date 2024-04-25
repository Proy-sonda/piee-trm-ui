import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { TipoDocumento } from '../(modelo)/tipo-documento';

export const buscarTiposDocumento = () => {
  return runFetchAbortable<TipoDocumento[]>(`${urlBackendTramitacion()}/tipoadjunto/all`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
};
