import { parseCookies } from 'nookies';
import { AgregarTrabajador, Trabajador, Trabajadores } from '../(modelos)/trabajadores';

const api_url = process.env.NEXT_PUBLIC_API_URL;
let cookie = parseCookies();
let token = cookie.token;

export const getTrabajadorUnidad = async (idunidad: number) => {
  const data = await fetch(`${api_url}trabajador/idunidad`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idunidad: idunidad,
    }),
  });

  return data;
};

export const deleteTrabajador = async (idtrabajador: number) => {
  const data = await fetch(`${api_url}trabajador/idtrabajador`, {
    method: 'DELETE',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idtrabajador: idtrabajador,
    }),
  });

  return data;
};

export const getUnidadEmpleador = async (rutempleador: string) => {
  const data = await fetch(`${api_url}unidad/rutempleador`, {
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

export const putTrabajador = async (trabajador: Trabajador) => {
  const data = await fetch(`${api_url}trabajador/edit`, {
    method: 'PUT',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(trabajador),
  });

  return data;
};

export const createTrabajador = async (trabajador: AgregarTrabajador) => {
  const data = await fetch(`${api_url}trabajador/create`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(trabajador),
  });

  return data;
};
