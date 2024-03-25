import { obtenerToken, runFetchConThrow, urlBackendTramitacion } from '@/servicios';
import { fileToBase64 } from '@/utilidades';

interface SubirAdjuntoNoTramitarRequest {
  folioLicencia: string;
  idOperador: number;
  archivo: File;
}

export class NoPuedeSubirAdjuntoNoTramitarError extends Error {}

/**
 * @throws {NoPuedeSubirAdjuntoNoTramitarError} Cuando no puede subir el archivo
 */
export const subirAdjuntoNoTramitar = async (request: SubirAdjuntoNoTramitarRequest) => {
  try {
    const payload = {
      documentos: [
        {
          name: request.archivo.name,
          codigooperador: request.idOperador,
          foliolicencia: request.folioLicencia,
          idtipoadjunto: 6,
          base64: await fileToBase64(request.archivo),
        },
      ],
    };

    if (payload.documentos.length === 0) {
      return;
    }

    await runFetchConThrow<void>(`${urlBackendTramitacion()}/licencia/zona3/upload`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new NoPuedeSubirAdjuntoNoTramitarError('');
  }
};
