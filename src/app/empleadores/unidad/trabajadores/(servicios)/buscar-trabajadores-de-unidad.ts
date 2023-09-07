import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';

export const buscarTrabajadoresDeUnidad = async (idunidad: number) => {
  const data = await fetch(`${apiUrl()}/trabajador/idunidad`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idunidad: idunidad,
    }),
  });

  return data;
};
