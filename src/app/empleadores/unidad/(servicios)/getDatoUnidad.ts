import { obtenerToken } from '@/servicios/auth';

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

  return res;
};
