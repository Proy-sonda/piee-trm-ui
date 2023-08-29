import { obtenerToken } from '@/servicios/auth';
import { Trabajador } from '../(modelos)/trabajador';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const actualizarTrabajador = async (trabajador: Trabajador) => {
  const data = await fetch(`${api_url}trabajador/edit`, {
    method: 'PUT',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(trabajador),
  });

  return data;
};
