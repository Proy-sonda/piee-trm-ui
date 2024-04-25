import { FetchResponse } from '@/hooks/use-merge-fetch';
import { UsuarioEntidadEmpleadoraAPI } from '@/modelos/usuario-entidad-empleadora-api';
import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import {
  UsuarioEntidadEmpleadora,
  usuarioEntidadEmpleadoraDesdeApi,
} from '../(modelos)/usuario-entidad-empleadora';

export const buscarUsuarios = (rutEmpleador: string): FetchResponse<UsuarioEntidadEmpleadora[]> => {
  const [request, abortador] = runFetchAbortable<UsuarioEntidadEmpleadoraAPI[]>(
    `${apiUrl()}/usuario/rutempleador`,
    {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ rutempleador: rutEmpleador }),
    },
  );

  const nuevoRequest = () => {
    return request()
      .then((usuarios) => usuarios.map((u) => usuarioEntidadEmpleadoraDesdeApi(u, rutEmpleador)))
      .then((usuarios) => usuarios.filter((u): u is UsuarioEntidadEmpleadora => !!u));
  };

  return [nuevoRequest, abortador];
};
