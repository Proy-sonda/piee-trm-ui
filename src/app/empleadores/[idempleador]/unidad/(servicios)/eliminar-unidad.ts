import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export const eliminarUnidad = (idUnidad: number) => {
  return runFetchConThrow<void>(`${apiUrl()}/unidad/idunidad`, {
    method: 'DELETE',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idunidad: idUnidad,
    }),
  });
};
