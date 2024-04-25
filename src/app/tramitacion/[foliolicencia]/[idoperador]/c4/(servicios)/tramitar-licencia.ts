import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export const tramitarLicenciaMedica = (folioLicencia: string, idOperador: number) => {
  const payload = {
    foliolicencia: folioLicencia,
    idoperador: idOperador,
  };

  return runFetchConThrow(`${urlBackendTramitacion()}/licencia/tramitar`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
