import { apiUrl } from '../environment';
import { runFetchConThrow } from '../fetch';

export const recuperarClave = (rutUsuario: string) => {
  return runFetchConThrow<void>(`${apiUrl()}/auth/recover`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rutusuario: rutUsuario,
    }),
  });
};
