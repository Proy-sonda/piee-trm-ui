import { obtenerToken } from '@/servicios/auth';
import { runFetchConThrow } from '@/servicios/fetch';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const eliminarUsuarioAso = (idusuario: number) => {
  return runFetchConThrow<void>(`${apiUrl}usuarioempleador/idusuarioempleador`, {
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
