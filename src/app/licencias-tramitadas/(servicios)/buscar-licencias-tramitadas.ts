import { obtenerToken, runFetchAbortable, urlBackendTramitacion } from '@/servicios';
import { LicenciaTramitada } from '../(modelos)/licencia-tramitada';

export const buscarLicenciasTramitadas = () => {
  return runFetchAbortable<LicenciaTramitada[]>(
    `${urlBackendTramitacion()}/licencia/tramitada/usuario`,
    {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
    },
  );
};
