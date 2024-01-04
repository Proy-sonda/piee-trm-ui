import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { ccafPropuesta } from '../(modelos)/idccaf-propuesta';

export const BuscarIDCCAFPropuesto = (idoperador: number, foliolicencia: string) => {
  return runFetchAbortable<ccafPropuesta>(`${urlBackendTramitacion()}/operadores/obtieneCCAF`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ idoperador, foliolicencia }),
  });
};
