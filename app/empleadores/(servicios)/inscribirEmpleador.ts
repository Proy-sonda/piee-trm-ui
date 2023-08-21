import { DatosInscribirEmpleador } from '@/app/empleadores/(modelos)/inscribirEmpleador';
import { parseCookies } from 'nookies';

export const InscribirEmpleador = async (empleador: DatosInscribirEmpleador) => {
  const cookie = parseCookies();
  const token = cookie.token;

  const data = await fetch('http://10.153.106.88:3000/empleador/inscribir', {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(empleador),
  });

  return data;
};
