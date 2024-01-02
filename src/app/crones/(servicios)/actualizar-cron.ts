import { urlBackendWorkers } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { FormularioEditarCron } from '../(modelos)';

interface ActualizarCronRequest extends FormularioEditarCron {
  idCron: number;
}

export const actualizarCron = (request: ActualizarCronRequest) => {
  const payload = {
    idCron: request.idCron,
    descripcion: request.descripcion,
    frecuencia: request.frecuencia,
  };

  return runFetchConThrow<void>(`${urlBackendWorkers()}/crons/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
