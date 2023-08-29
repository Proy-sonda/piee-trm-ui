import { obtenerToken } from '@/servicios/auth';
import { CrearUnidad } from '../(modelos)/nuevaUnidad';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const crearUnidad = async (unidad: CrearUnidad) => {
  const data = await fetch(`${api_url}unidad/create`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(unidad),
  });
  return data;
};
