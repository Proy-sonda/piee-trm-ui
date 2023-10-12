import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { Trabajadores } from '../(modelos)';

export const buscarTrabajadoresDeUnidad = (idunidad: number) => {
  return runFetchAbortable<Trabajadores[]>(`${apiUrl()}/trabajador/idunidad`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idunidad: idunidad,
    }),
  });
};
