import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { UsuarioEmpleador } from '../(modelos)/iusuarioaso';

export const buscarUsuariosAso = (idunidad: number) => {
  return runFetchAbortable<UsuarioEmpleador[]>(`${apiUrl()}usuarioempleador/idusuarioempleador`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idunidad,
    }),
  });
};
