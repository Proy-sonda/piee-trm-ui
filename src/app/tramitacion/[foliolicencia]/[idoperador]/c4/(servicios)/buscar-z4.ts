import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { LicenciaC4 } from '../(modelos)/licencia-c4';

export const buscarZona4 = (folioLicencia: string, idOperador: number) => {
  return runFetchAbortable<LicenciaC4[] | undefined>(
    `${urlBackendTramitacion()}/licencia/zona4/operadorfolio`,
    {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        foliolicencia: folioLicencia,
        idoperador: idOperador,
      }),
    },
  );
};
