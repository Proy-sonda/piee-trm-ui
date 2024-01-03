import { urlBackendWorkers } from '@/servicios/environment';
import { HttpError, runFetchConThrow } from '@/servicios/fetch';
import { FormularioEditarCron } from '../(modelos)';

interface ActualizarCronRequest extends FormularioEditarCron {
  idCron: number;
}

export class FormatoFrecuenciaIncorrectoError extends Error {}

export const actualizarCron = async (request: ActualizarCronRequest) => {
  const payload = {
    idCron: request.idCron,
    descripcion: request.descripcion,
    frecuencia: request.frecuencia,
  };

  try {
    await runFetchConThrow<void>(`${urlBackendWorkers()}/crons/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (
      error instanceof HttpError &&
      error.body.message?.includes('frecuencia|formato incorrecto')
    ) {
      throw new FormatoFrecuenciaIncorrectoError();
    }

    throw error;
  }
};
