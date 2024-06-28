import { UsuarioClaveUnica } from '@/modelos/clave-unica/usuario-clave-unica';
import { apiUrl } from '@/servicios';
import { runFetchAbortable } from '@/servicios/fetch';

export const buscaUsuarioClaveUnica = (code: string, state: string) => {
  const payload = { code, state };

  return runFetchAbortable<UsuarioClaveUnica>(`${apiUrl()}/claveunica/infousuario`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
