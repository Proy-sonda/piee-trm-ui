import { obtenerToken, runFetchAbortable, urlBackendTramitacion } from '@/servicios';
import { EstadoTramitacion } from '../(modelos)';

export const buscarEstadosTramitacion = () => {
  return runFetchAbortable<EstadoTramitacion[]>(
    `${urlBackendTramitacion()}/estadotramitacion/all`,
    {
      method: 'GET',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
    },
  );
};
