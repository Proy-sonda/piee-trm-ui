import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export const desadscribirEmpleador = async (rut: string) => {
  return runFetchConThrow<void>(`${apiUrl()}/empleador/desuscribir`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rutempleador: rut,
    }),
  });
};
