import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { UnidadEmpleador } from '../(modelos)';

export const buscarUnidadesDeEmpleador = (rutempleador: string) => {
  return runFetchAbortable<UnidadEmpleador[]>(`${apiUrl()}/unidad/rutempleador`, {
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
