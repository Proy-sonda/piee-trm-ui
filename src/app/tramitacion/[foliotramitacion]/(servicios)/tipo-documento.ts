import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { tipoDocumento } from '../(modelo)/documento';

export const BuscarTipoDocumento = () => {
  return runFetchAbortable<tipoDocumento[]>(`${urlBackendTramitacion()}/tipoadjunto/all`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
};
