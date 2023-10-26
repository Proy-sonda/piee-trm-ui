import { UsuarioToken } from '@/modelos/usuario';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { setearCookieAutenticacion } from './cookie-autenticacion';
import { obtenerToken } from './obtener-token';

/**
 * Refresca el token de autenticacion y refresca la cookie con el token
 */
export const renovarToken = async (): Promise<UsuarioToken> => {
  const token = await runFetchConThrow<string>(
    `${apiUrl()}/auth/refresh`,
    {
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
    },
    {
      bodyAs: 'text',
    },
  );

  setearCookieAutenticacion(token);

  return UsuarioToken.fromToken(token);
};
