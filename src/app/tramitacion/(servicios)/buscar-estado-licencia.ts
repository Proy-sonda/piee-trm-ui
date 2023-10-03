import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { EstadoLicencia } from '../(modelos)/estado-licencia';

export const buscarEstadosLicencia = () => {
  return runFetchAbortable<EstadoLicencia[]>(`${urlBackendTramitacion()}/estadolicencia/all`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-Type': 'application/json',
    },
  });
};
