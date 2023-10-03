import { Empleador } from '@/modelos/empleador';
import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';

export const buscarEmpleadores = (razon = '') => {
  return runFetchAbortable<Empleador[]>(`${apiUrl()}/empleador/razonsocial`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razonsocial: razon ?? '',
    }),
  });
};
