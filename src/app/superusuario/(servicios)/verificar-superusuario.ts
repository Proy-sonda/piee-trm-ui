import { UsuarioToken } from '@/modelos/usuario';
import { obtenerToken } from '@/servicios';
import { setearCookieAutenticacion } from '@/servicios/auth/cookie-autenticacion';
import { apiUrl } from '@/servicios/environment';
import { HttpError, runFetchConThrow } from '@/servicios/fetch';

export class RutInvalidoError extends Error {}

export class LoginPasswordInvalidoError extends Error {}

export class AutenticacionTransitoriaError extends Error {}

export class UsuarioNoExisteError extends Error {}

export const VerificarUsuario = async (rutusuario: string): Promise<UsuarioToken> => {
  try {
    const token = await runFetchConThrow<string>(
      `${apiUrl()}/auth/super/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: obtenerToken(),
        },
        body: JSON.stringify({
          rutusuario,
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
