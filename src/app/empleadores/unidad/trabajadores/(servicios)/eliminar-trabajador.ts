import { obtenerToken } from '@/servicios/auth';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const eliminarTrabajador = async (idtrabajador: number) => {
  const data = await fetch(`${api_url}trabajador/idtrabajador`, {
    method: 'DELETE',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idtrabajador: idtrabajador,
    }),
  });

  return data;
};
