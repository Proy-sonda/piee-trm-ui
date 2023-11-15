import { Empleador } from '@/modelos/empleador';
import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';

export const buscarEmpleadorRut = (rut: string) => {
  return runFetchAbortable<Empleador>(`${apiUrl()}/empleador/rutempleador`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      rutempleador: rut,
    }),
  });
};
