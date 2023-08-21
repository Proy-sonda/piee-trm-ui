import { HttpError } from '@/app/hooks/useFetch';
import { obtenerToken } from '@/app/servicios/auth';
import { UnidadResp } from '../(modelos)/UnidadResp';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const getDatoUnidad = async (idUnidad: number) => {
  const res = await fetch(`${api_url}unidad/idunidad`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idunidad: idUnidad,
    }),
  });

  if (!res.ok) {
    throw new HttpError(res.status, res.statusText, 'Error en la respuesta', res.url, res.json());
  }

  const data = await res.json();

  return data as UnidadResp;
};
