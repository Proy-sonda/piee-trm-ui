import { parseCookies } from 'nookies';

export const buscarEmpleadores = async (razon = '') => {
  const cookie = parseCookies();
  const token = cookie.token;

  const data = await fetch('http://10.153.106.88:3000/empleador/razonsocial', {
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
