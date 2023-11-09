import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { UsuarioEntidadEmpleadora } from '../(modelos)/usuario-entidad-empleadora';

export const buscarUsuarioPorRut = (rut: string) => {
  return runFetchAbortable<UsuarioEntidadEmpleadora | undefined>(`${apiUrl()}/usuario/rutusuario`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      rutusuario: rut,
    }),
  });
};
