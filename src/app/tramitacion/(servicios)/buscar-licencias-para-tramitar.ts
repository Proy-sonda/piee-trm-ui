import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { LicenciaTramitar } from '../(modelos)/licencia-tramitar';

export const buscarLicenciasParaTramitar = () => {
  return runFetchAbortable<LicenciaTramitar[]>(
    `${urlBackendTramitacion()}/operadores/all/tramitacion`,
    {
      headers: {
        Authorization: obtenerToken(),
        'Content-Type': 'application/json',
      },
    },
  );
};
