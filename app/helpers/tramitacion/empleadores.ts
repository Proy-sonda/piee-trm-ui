import { UpdateUnidad } from '@/app/empleadores/interface/UpdateUnidad';
import { CrearUnidad } from '@/app/empleadores/interface/crearUnidad';
import { ActualizaEmpleador } from '@/app/interface/tramitacion';
import { parseCookies } from 'nookies';
let cookie = parseCookies();
let token = cookie.token;

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const ComboEntidadEmpleador = async () => {
  const data = await fetch(`${api_url}/empleador/rutusuario`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
  });

  let resp = await data.json();

  return resp;
};

export const cargaUnidadrrhh = async (rutempleador: string) => {
  const data = await fetch(`${api_url}/unidad/rutempleador`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      rutempleador: rutempleador,
    }),
  });
  let resp = await data.json();
  return resp;
};

export const EliminarUnidad = async (idunidad: number) => {
  const data = await fetch(`${api_url}/unidad/idunidad`, {
    method: 'DELETE',
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

export const crearUnidad = async (unidad: CrearUnidad) => {
  const data = await fetch(`${api_url}/unidad/create`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(unidad),
  });
  return data;
};

export const getDatoUnidad = async (idunidad: number) => {
  const data = await fetch(`${api_url}unidad/idunidad`, {
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

export const putDatoUnidad = async (unidad: UpdateUnidad) => {
  const data = await fetch(`${api_url}unidad/update`, {
    method: 'PUT',
    headers: {
      Authorization: token,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(unidad),
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
