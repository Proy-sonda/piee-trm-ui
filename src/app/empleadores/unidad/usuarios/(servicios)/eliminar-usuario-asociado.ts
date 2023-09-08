import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export const eliminarUsuarioAso = (idusuario: number) => {
  return runFetchConThrow<void>(`${apiUrl()}usuarioempleador/idusuarioempleador`, {
    method: 'delete',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idusuarioempleador: idusuario,
    }),
  });
};
