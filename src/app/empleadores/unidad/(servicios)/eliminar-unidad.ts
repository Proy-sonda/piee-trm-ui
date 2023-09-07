import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';

export const eliminarUnidad = async (idUnidad: number) => {
  const data = await fetch(`${apiUrl()}/unidad/idunidad`, {
    method: 'DELETE',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idunidad: idUnidad,
    }),
  });
  return data;
};
