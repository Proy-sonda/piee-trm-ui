import { apiUrl } from '../environment';
import { HttpError, runFetchConThrow } from '../fetch';

type CambiarClaveRequest = {
  rutUsuario: string;
  claveTransitoria: string;
  claveNueva: string;
  confirmaClaveNueva: string;
};

export class ClaveTemporalInvalidaError extends Error {}

export const cambiarClave = async (request: CambiarClaveRequest) => {
  try {
    await runFetchConThrow<void>(`${apiUrl()}/auth/change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rutusuario: request.rutUsuario,
        claveanterior: request.claveTransitoria,
        clavenuevauno: request.claveNueva,
        clavenuevados: request.confirmaClaveNueva,
      }),
    });

    return;
  } catch (error) {
    if (error instanceof HttpError && error.body.message === 'Login/Password invalida') {
      throw new ClaveTemporalInvalidaError();
    }

    throw error;
  }
};
