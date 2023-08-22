import { parseCookies } from 'nookies';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarEmpleadores = async (razon = '') => {
  const cookie = parseCookies();
  const token = cookie.token;

  const data = await fetch(`${apiUrl}empleador/razonsocial`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razonsocial: razon,
    }),
  });

  const resp = await data.json();

  return resp;
};
