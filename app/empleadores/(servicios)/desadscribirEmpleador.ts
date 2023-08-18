import { parseCookies } from 'nookies';

export const Desadscribir = async (rut: string) => {
  const cookie = parseCookies();
  const token = cookie.token;

  let data: Response;
  data = await fetch('http://10.153.106.88:3000/empleador/desuscribir', {
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
