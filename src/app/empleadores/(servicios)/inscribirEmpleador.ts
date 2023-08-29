import { DatosInscribirEmpleador } from '@/app/empleadores/(modelos)/inscribirEmpleador';
import { parseCookies } from 'nookies';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const InscribirEmpleador = async (empleador: DatosInscribirEmpleador) => {
  const cookie = parseCookies();
  const token = cookie.token;

  const data = await fetch(`${apiUrl}empleador/inscribir`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(empleador),
  });

  return data;
};
