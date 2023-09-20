import { UserData } from '@/contexts/modelos/types';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import jwt_decode from 'jwt-decode';
import { setCookie } from 'nookies';
import { obtenerToken } from './obtener-token';

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
  const ahoraEnSegundos = Math.round(Date.now() / 1000);
  const maxAge = tokenDecodificado.exp - ahoraEnSegundos;

  setCookie(null, 'token', token, { maxAge, path: '/' });

  return token;
};
