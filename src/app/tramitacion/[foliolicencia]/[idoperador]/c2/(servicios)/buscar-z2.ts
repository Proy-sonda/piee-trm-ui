import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { Licenciac2 } from '../(modelos)/licencia-c2';

export const buscarZona2 = (foliolicencia: string, idoperador: number) => {
  return runFetchAbortable<Licenciac2>(`${urlBackendTramitacion()}/licencia/zona2/operadorfolio`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      foliolicencia,
      idoperador,
    }),
  });
};
