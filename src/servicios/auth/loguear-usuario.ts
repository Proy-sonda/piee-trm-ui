import { UsuarioToken } from '@/modelos/usuario';
import { apiUrl, urlBackendSuperUsuario } from '@/servicios/environment';
import { HttpError, runFetchConThrow } from '@/servicios/fetch';
import { setearCookieAutenticacion } from './cookie-autenticacion';

export class RutInvalidoError extends Error {}

export class LoginPasswordInvalidoError extends Error {}

export class AutenticacionTransitoriaError extends Error {}

export class UsuarioNoExisteError extends Error {}

/**
 * **NO USAR DIRECTAMENTE. USAR LA QUE VIENE EN EL AuthContext**
 *
 * Setea cookie con el token de autenticacion
 */
export const loguearUsuario = async (
  rut: string,
  clave: string,
  rutsuper?: string,
): Promise<UsuarioToken> => {
  let usuario;
  if (rutsuper) {
    usuario = {
      rutusuario: rut,
      clave: clave,
      rutsuper: rutsuper,
    };
  } else {
    usuario = {
      rutusuario: rut,
      clave: clave,
    };
  }

  try {
    const token = await runFetchConThrow<string>(
      `${apiUrl()}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...usuario,
        }),
      },
      {
        bodyAs: 'text',
      },
    );

    setearCookieAutenticacion(token);

    return UsuarioToken.fromToken(token);
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

export const loginSuperUsuario = async (
  rutusuario: string,
  clave: string,): Promise<UsuarioToken> => {
  try {
    const token = await runFetchConThrow<string>(
      `${urlBackendSuperUsuario()}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rutusuario,
          clave
        }),
      },
      {
        bodyAs: 'text',
      },
    );
    console.log(token)

    setearCookieAutenticacion(token);
    return UsuarioToken.fromToken(token);
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
}
