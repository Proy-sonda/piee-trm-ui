import { obtenerToken } from '@/servicios/auth';
import { runFetch } from '@/servicios/fetch';
import { UsuarioEntidadEmpleadora } from '../(modelos)/UsuarioEntidadEmpleadora';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarUsuarios = (rutEmpleador: string) => {
  return runFetch<UsuarioEntidadEmpleadora[]>(
    fetch(`${apiUrl}usuario/rutempleador`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ rutempleador: rutEmpleador }),
    }),
  );
};
