import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { Empleador } from '../(modelo)/empleador';

export const buscarEmpleador = (rutempleador: string) => {
  return runFetchAbortable<Empleador>(`${apiUrl()}/empleador/rutempleador`, {
    method: 'POST',

    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      rutempleador: rutempleador,
    }),
  });
};
