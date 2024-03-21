import { obtenerToken, runFetchAbortable, urlBackendTramitacion } from '@/servicios';
import { LicenciaHistorica } from '../(modelos)/licencia-historica';

export const buscarLicenciasHistoricas = () => {
  return runFetchAbortable<LicenciaHistorica[]>(
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
