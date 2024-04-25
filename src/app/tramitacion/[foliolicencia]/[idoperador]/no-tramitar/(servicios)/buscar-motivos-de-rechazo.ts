import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { MotivoDeRechazo } from '../(modelos)/motivo-de-rechazo';

export const buscarMotivosDeRechazo = () => {
  return runFetchAbortable<MotivoDeRechazo[]>(`${urlBackendTramitacion()}/motivonorecepcion/all`, {
    method: 'GET',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
};
