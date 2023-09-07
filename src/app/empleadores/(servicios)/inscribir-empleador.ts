import { DatosInscribirEmpleador } from '@/app/empleadores/(modelos)/datos-inscribir-empleador';
import { apiUrl } from '@/servicios/environment';
import { parseCookies } from 'nookies';

export const InscribirEmpleador = async (empleador: DatosInscribirEmpleador) => {
  const cookie = parseCookies();
  const token = cookie.token;

  const data = await fetch(`${apiUrl()}/empleador/inscribir`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(empleador),
  });

  return data;
};
