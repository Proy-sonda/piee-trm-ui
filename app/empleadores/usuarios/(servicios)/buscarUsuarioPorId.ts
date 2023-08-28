import { obtenerToken } from '@/app/servicios/auth';
import { runFetch } from '@/app/servicios/fetch';
import { UsuarioEntidadEmpleadora } from '../(modelos)/UsuarioEntidadEmpleadora';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarUsuarioPorId = async (id: number) => {
  return runFetch<UsuarioEntidadEmpleadora>(
    fetch(`${apiUrl}usuario/idusuario`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        idusuario: id,
      }),
    }),
  );
};
