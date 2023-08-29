import { obtenerToken } from '@/servicios/auth';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const buscarTrabajadoresDeUnidad = async (idunidad: number) => {
  const data = await fetch(`${api_url}trabajador/idunidad`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idunidad: idunidad,
    }),
  });

  return data;
};
