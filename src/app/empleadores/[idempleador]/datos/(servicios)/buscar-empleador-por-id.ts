import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { EmpleadorPorId } from '../(modelos)/empleador-por-id';

export const buscarEmpleadorPorId = (idEmpleador: number) => {
  return runFetchAbortable<EmpleadorPorId | undefined>(`${apiUrl()}/empleador/idempleador`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ idempleador: idEmpleador }),
  });
};
