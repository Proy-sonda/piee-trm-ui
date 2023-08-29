import { obtenerToken } from '@/servicios/auth';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const buscarUnidadesDeEmpleador = async (rutempleador: string) => {
  const data = await fetch(`${api_url}unidad/rutempleador`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      rutempleador: rutempleador,
    }),
  });

  return data;
};
