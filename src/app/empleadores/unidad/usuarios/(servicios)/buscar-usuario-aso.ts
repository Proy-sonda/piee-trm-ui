import { obtenerToken } from '@/servicios/auth';
import { runFetchAbortable } from '@/servicios/fetch';
import { UsuarioEmpleador } from '../(modelos)/iusuarioaso';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarUsuariosAso = (idunidad: number) => {
  return runFetchAbortable<UsuarioEmpleador[]>(`${apiUrl}usuarioempleador/idusuarioempleador`, {
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
