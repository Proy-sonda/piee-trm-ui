import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { Trabajador } from '../(modelos)/trabajador';

export const actualizarTrabajador = async (trabajador: Trabajador) => {
  const data = await fetch(`${apiUrl()}/trabajador/edit`, {
    method: 'PUT',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(trabajador),
  });

  return data;
};
