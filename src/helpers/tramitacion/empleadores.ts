import { apiUrl } from '@/servicios/environment';
import { parseCookies } from 'nookies';
let cookie = parseCookies();
let token = cookie.token;

export const ComboEntidadEmpleador = async () => {
  const data = await fetch(`${apiUrl()}/empleador/rutusuario`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
  });

  let resp = await data.json();

  return resp;
};

export const renovacionToken = async () => {
  const data = await fetch(`${apiUrl()}/auth/refresh`, {
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
  });
  return data;
};

export const Logout = async () => {
  const data = await fetch(`${apiUrl()}/auth/logout`, {
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
  });

  return data;
};
