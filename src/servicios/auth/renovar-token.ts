import { UserData } from '@/modelos/user-data';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import jwt_decode from 'jwt-decode';
import { setCookie } from 'nookies';
import { obtenerToken } from './obtener-token';

/**
 * Refresca el token de autenticacion y lo guarda
 */
export const renovarToken = async (): Promise<string> => {
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

  const tokenDecodificado = jwt_decode(token.substring('Bearer '.length)) as UserData;
  const maxAge = tokenDecodificado.exp - tokenDecodificado.iat;

  setCookie(null, 'token', token, { maxAge, path: '/' });

  return token;
};
