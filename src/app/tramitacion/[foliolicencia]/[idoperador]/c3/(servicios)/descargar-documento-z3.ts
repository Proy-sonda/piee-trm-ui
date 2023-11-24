import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export const descargarDocumentoZ3 = (idAdjunto: string) => {
  const payload = { id: idAdjunto };

  return runFetchConThrow<{ url: string }>(`${urlBackendTramitacion()}/licencia/zona3/download`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
