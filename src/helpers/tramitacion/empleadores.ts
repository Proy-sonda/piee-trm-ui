import { ActualizaEmpleador } from '@/modelos/tramitacion';
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

export const datoEmpresa = async (rutempleador: string) => {
  const data = await fetch(`${api_url}empleador/rutempleador`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      rutempleador: rutempleador,
    }),
  });

  return data;
};

export const actualizaEmpleador = async (empleador: ActualizaEmpleador) => {
  const data = await fetch(`${api_url}empleador/actualizar`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(empleador),
  });

  return data;
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
