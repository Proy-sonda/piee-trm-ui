import { UserData, UsuarioLogin } from '@/contexts/modelos/types';
import { apiUrl } from '@/servicios/environment';
import { HttpError, runFetchConThrow } from '@/servicios/fetch';
import jwt_decode from 'jwt-decode';
import { setCookie } from 'nookies';

export class RutInvalidoError extends Error {}

export class LoginPasswordInvalidoError extends Error {}

export class AutenticacionTransitoriaError extends Error {}

export class UsuarioNoExisteError extends Error {}

export const loguearUsuario = async (usuario: UsuarioLogin): Promise<UserData> => {
  try {
    const token = await runFetchConThrow<string>(
      `${apiUrl()}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      },
      {
        bodyAs: 'text',
      },
    );

    const tokenDecodificado = jwt_decode(token.substring('Bearer '.length)) as UserData;
    const ahoraEnSegundos = Math.round(Date.now() / 1000);
    const maxAge = tokenDecodificado.exp - ahoraEnSegundos;

    setCookie(null, 'token', token, { maxAge, path: '/' });

    return tokenDecodificado;
  } catch (error) {
    if (error instanceof HttpError) {
      if (error.status === 400 && error.body.message.includes('rutusuario|invalido')) {
        throw new RutInvalidoError();
      }

      if (error.status === 401 && error.body.message === 'Usuario no existe') {
        throw new UsuarioNoExisteError();
      }

      if (error.status === 401 && error.body.message === 'Login/Password invalida') {
        throw new LoginPasswordInvalidoError();
      }

      if (error.status === 412 && error.body.message === 'Autenticación Transitoria') {
        throw new AutenticacionTransitoriaError();
      }
    }

    throw error;
  }
};
