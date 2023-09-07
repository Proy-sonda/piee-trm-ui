import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';

export const eliminarTrabajador = async (idtrabajador: number) => {
  const data = await fetch(`${apiUrl()}/trabajador/idtrabajador`, {
    method: 'DELETE',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idtrabajador: idtrabajador,
    }),
  });

  return data;
};
