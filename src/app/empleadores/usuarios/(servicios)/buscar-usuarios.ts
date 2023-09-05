import { obtenerToken } from '@/servicios/auth';
import { runFetchAbortable } from '@/servicios/fetch';
import { UsuarioEntidadEmpleadora } from '../(modelos)/usuario-entidad-empleadora';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarUsuarios = (rutEmpleador: string) => {
  return runFetchAbortable<UsuarioEntidadEmpleadora[]>(`${apiUrl}usuario/rutempleador`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ rutempleador: rutEmpleador }),
  });
};
