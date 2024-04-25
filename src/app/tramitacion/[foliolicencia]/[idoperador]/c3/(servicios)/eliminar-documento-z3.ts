import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export const eliminarDocumentoZ3 = (idAdjunto: string) => {
  const payload = { id: idAdjunto };

  return runFetchConThrow<void>(`${urlBackendTramitacion()}/licencia/zona3/delete`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
