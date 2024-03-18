import { HttpError, obtenerToken, runFetchConThrow, urlBackendTramitacion } from '.';

export class NoExistePdfLicenciaError extends Error {}

/**
 * @returns Un archivo en base 64 con el pdf de la licencia.
 *
 * @throws {NoExistePdfLicenciaError} Cuando la licencia no existe.
 */
export const buscarPdfLicencia = async (folioLicencia: string, idOperador: number) => {
  const payload = {
    idoperador: idOperador,
    foliolicencia: folioLicencia,
  };

  try {
    const archivo = await runFetchConThrow<{ archivo: string }>(
      `${urlBackendTramitacion()}/operadores/lmeconsultapdf`,
      {
        method: 'POST',
        headers: {
          Authorization: obtenerToken(),
          'Content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    return archivo;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      throw new NoExistePdfLicenciaError('');
    }

    throw error;
  }
};
