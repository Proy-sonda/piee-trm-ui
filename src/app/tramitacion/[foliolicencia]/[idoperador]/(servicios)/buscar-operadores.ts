import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { Operador } from '../(modelo)/operador';

export const buscarOperadores = () => {
  return runFetchAbortable<Operador[]>(`${apiUrl()}/operador/all`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-Type': 'application/json',
    },
  });
};
