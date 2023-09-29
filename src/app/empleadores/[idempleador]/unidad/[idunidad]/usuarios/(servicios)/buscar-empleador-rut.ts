import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { Empleadorusu } from '../(modelos)/empleador-usuario';

export const buscarEmpleadorRut = (rut: string) => {
  return runFetchAbortable<Empleadorusu>(`${apiUrl()}/empleador/rutempleador`, {
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
