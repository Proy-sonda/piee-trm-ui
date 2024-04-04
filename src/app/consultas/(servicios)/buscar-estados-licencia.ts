import { obtenerToken, runFetchAbortable, urlBackendTramitacion } from '@/servicios';
import { EstadoLicencia } from '../(modelos)';

export const buscarEstadosLicencias = () => {
  return runFetchAbortable<EstadoLicencia[]>(`${urlBackendTramitacion()}/estadolicencia/all`, {
    method: 'GET',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
};
