import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { UsuarioEntidadEmpleadora } from '../(modelos)/usuario-entidad-empleadora';

export const buscarUsuarioPorId = (id: number) => {
  return runFetchAbortable<UsuarioEntidadEmpleadora>(`${apiUrl()}/usuario/idusuario`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idusuario: id,
    }),
  });
};
