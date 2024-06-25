import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { UsuarioEntidadEmpleadora } from '../(modelos)/usuario-entidad-empleadora';

type EliminarUsuarioRequest = UsuarioEntidadEmpleadora & {
  idEmpleador: number;
  rutEmpleador: string;
};

export const eliminarUsuario = async (request: EliminarUsuarioRequest) => {
  const payload = {
    idusuario: request.idusuario,
    idempleador: request.idEmpleador,
  };

  return runFetchConThrow<void>(`${apiUrl()}/usuario/idusuario`, {
    method: 'DELETE',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
