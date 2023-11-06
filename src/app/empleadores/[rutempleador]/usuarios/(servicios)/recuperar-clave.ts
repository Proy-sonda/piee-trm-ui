import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export const recuperarContrasena = async (rut: string) => {
  return runFetchConThrow<void>(`${apiUrl()}/auth/recover`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      rutusuario: rut,
    }),
  });
};
