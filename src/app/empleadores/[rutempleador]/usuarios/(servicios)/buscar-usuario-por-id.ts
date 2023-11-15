import { FetchResponse } from '@/hooks/use-merge-fetch';
import { UsuarioEntidadEmpleadoraAPI } from '@/modelos/usuario-entidad-empleadora-api';
import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import {
  UsuarioEntidadEmpleadora,
  usuarioEntidadEmpleadoraDesdeApi,
} from '../(modelos)/usuario-entidad-empleadora';
import { UsuarioNoPerteneceAEmpleadorError } from '../(modelos)/usuario-no-pertenece-a-empleador-error';

export const buscarUsuarioPorId = (
  id: number,
  rutEmpleador: string,
): FetchResponse<UsuarioEntidadEmpleadora> => {
  const [request, abortador] = runFetchAbortable<UsuarioEntidadEmpleadoraAPI>(
    `${apiUrl()}/usuario/idusuario`,
    {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        idusuario: id,
      }),
    },
  );

  const nuevoRequest = () => {
    return request()
      .then((u) => usuarioEntidadEmpleadoraDesdeApi(u, rutEmpleador))
      .then((usuario) => {
        if (!usuario) {
          throw new UsuarioNoPerteneceAEmpleadorError();
        }

        return usuario;
      });
  };

  return [nuevoRequest, abortador];
};
