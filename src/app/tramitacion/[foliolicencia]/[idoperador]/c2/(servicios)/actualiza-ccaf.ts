import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export class ErrorGuardarCCAF extends Error {}

export const GuardarCCAF = async (idoperador: number, idccaf: string, foliolicencia: string) => {
  try {
    await runFetchConThrow<void>(`${urlBackendTramitacion()}/licencia/zona0/actualizaccaf`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ idoperador, idccaf, foliolicencia }),
    });
  } catch (error) {
    throw new ErrorGuardarCCAF();
  }
};
