import { urlBackendWorkers } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export const detenerCron = (idCron: number) => {
  const payload = { idCron };

  return runFetchConThrow<void>(`${urlBackendWorkers()}/crons/detener`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
