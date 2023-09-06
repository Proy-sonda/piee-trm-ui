import { obtenerToken } from '@/servicios/auth';
import { runFetchAbortable } from '@/servicios/fetch';
import { EmpleadorPorId } from '../(modelos)/empleador-por-id';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarEmpleadorPorId = (idEmpleador: number) => {
  return runFetchAbortable<EmpleadorPorId | undefined>(`${apiUrl}empleador/idempleador`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ idempleador: idEmpleador }),
  });
};
