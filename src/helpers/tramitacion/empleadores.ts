import { parseCookies } from 'nookies';
let cookie = parseCookies();
let token = cookie.token;

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const ComboEntidadEmpleador = async () => {
  const data = await fetch(`${api_url}empleador/rutusuario`, {
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
  const data = await fetch(`${api_url}auth/refresh`, {
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
  });
  return data;
};

export const Logout = async () => {
  const data = await fetch(`${api_url}auth/logout`, {
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
  });

  return data;
};
