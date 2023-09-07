import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export const eliminarUsuario = async (id: number) => {
  return runFetchConThrow<void>(`${apiUrl()}/usuario/idusuario`, {
    method: 'DELETE',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idusuario: id,
    }),
  });
};
