import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { UnidadRRHH } from '../(modelos)/unidad-rrhh';

export const buscarUnidadPorId = (idUnidad: number) => {
  return runFetchAbortable<UnidadRRHH>(`${apiUrl()}/unidad/idunidad`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idunidad: idUnidad,
    }),
  });
};

/**
 * @deprecated
 * Usar {@link buscarUnidadPorId} en su lugar
 */
export const buscarUnidadPorIdViejo = async (idUnidad: number) => {
  const res = await fetch(`${apiUrl()}/unidad/idunidad`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idunidad: idUnidad,
    }),
  });

  return res;
};
