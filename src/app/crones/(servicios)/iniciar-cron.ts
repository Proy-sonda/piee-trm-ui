import { urlBackendWorkers } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export const iniciarCron = (idCron: number) => {
  const payload = { idCron };

  return runFetchConThrow<void>(`${urlBackendWorkers()}/crons/iniciar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
