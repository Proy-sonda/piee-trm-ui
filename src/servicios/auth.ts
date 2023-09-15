import { UserData, UsuarioLogin } from '@/contexts/modelos/types';
import jwt_decode from 'jwt-decode';
import { parseCookies, setCookie } from 'nookies';
import { apiUrl } from './environment';
import { HttpError, runFetchConThrow } from './fetch';

export const obtenerToken = () => {
  const cookie = parseCookies();
  return cookie.token;
};

export const estaLogueado = (): boolean => {
  const token = obtenerToken();

  return token !== undefined && token !== null;
};

export const renovacionToken = async () => {
  const data = await fetch(`${apiUrl()}/auth/refresh`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
  return data;
};

export const Logout = async () => {
  const data = await fetch(`${apiUrl()}/auth/logout`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });

  return data;
};

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

    setCookie(null, 'token', token, { maxAge: 3600, path: '/' });

    return jwt_decode(token.substring('Bearer '.length)) as UserData;
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

export const CompruebaToken = async (token: string) => {
  try {
    const resp = await fetch(`${apiUrl()}/auth/islogin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resp.status == 200) return console.log('token valido');
  } catch (error) {
    console.log('error: ' + error);
  }
};
