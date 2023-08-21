import { obtenerToken } from '@/app/servicios/auth';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const eliminarUnidad = async (idUnidad: number) => {
  const data = await fetch(`${api_url}unidad/idunidad`, {
    method: 'DELETE',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idunidad: idUnidad,
    }),
  });
  return data;
};
