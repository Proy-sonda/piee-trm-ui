import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';

export const buscarUnidadPorId = async (idUnidad: number) => {
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
