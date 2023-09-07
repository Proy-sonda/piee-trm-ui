import { apiUrl } from '@/servicios/environment';
import { parseCookies } from 'nookies';

export const Desadscribir = async (rut: string) => {
  const cookie = parseCookies();
  const token = cookie.token;

  let data: Response;
  data = await fetch(`${apiUrl()}/empleador/desuscribir`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rutempleador: rut,
    }),
  });
  return data;
};
