import { UsuarioToken } from '@/modelos/usuario';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { setCookie } from 'nookies';
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

  const usuario = UsuarioToken.fromToken(token);

  setCookie(null, 'token', token, { maxAge: usuario.vigenciaToken(), path: '/' });

  return usuario;
};
