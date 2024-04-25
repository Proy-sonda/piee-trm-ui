import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { LicenciaC0 } from '../(modelos)';

export const buscarZona0 = (foliolicencia: string, idoperador: number) => {
  return runFetchAbortable<LicenciaC0>(`${urlBackendTramitacion()}/licencia/zona0/operadorfolio`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      foliolicencia: foliolicencia,
      idoperador: idoperador,
    }),
  });
};
