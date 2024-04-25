import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { LicenciaC1 } from '../(modelos)';

export const buscarZona1 = (foliolicencia: string, idoperador: number) => {
  return runFetchAbortable<LicenciaC1 | undefined>(
    `${urlBackendTramitacion()}/licencia/zona1/operadorfolio`,
    {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        foliolicencia: foliolicencia,
        idoperador: idoperador,
      }),
    },
  );
};
