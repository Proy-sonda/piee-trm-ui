import { UserData } from '@/modelos/user-data';
import { apiUrl } from '@/servicios/environment';
import { HttpError, runFetchConThrow } from '@/servicios/fetch';
import jwt_decode from 'jwt-decode';
import { setCookie } from 'nookies';

export class RutInvalidoError extends Error {}

export class LoginPasswordInvalidoError extends Error {}

export class AutenticacionTransitoriaError extends Error {}

export class UsuarioNoExisteError extends Error {}

/**
 * **NO USAR DIRECTAMENTE. USAR LA QUE VIENE EN EL AuthContext**
 *
 * Setea cookie con el token de autenticacion
 */
export const loguearUsuario = async (rut: string, clave: string): Promise<UserData> => {
  try {
    const token = await runFetchConThrow<string>(
      `${apiUrl()}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rutusuario: rut,
          clave: clave,
        }),
      },
      {
        bodyAs: 'text',
      },
    );

    const tokenDecodificado = jwt_decode(token.substring('Bearer '.length)) as UserData;
    const maxAge = tokenDecodificado.exp - tokenDecodificado.iat;

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
