import { obtenerToken } from '@/servicios/auth';
import { runFetchConThrow } from '@/servicios/fetch';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const eliminarUsuario = async (id: number) => {
  return runFetchConThrow<void>(
    fetch(`${apiUrl}usuario/idusuario`, {
      method: 'DELETE',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        idusuario: id,
      }),
    }),
  );
};
