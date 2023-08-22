import { obtenerToken } from '@/app/servicios/auth';
import { UpdateUnidad } from '../(modelos)/UpdateUnidad';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const actualizarUnidad = async (unidad: UpdateUnidad) => {
  const data = await fetch(`${api_url}unidad/update`, {
    method: 'PUT',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(unidad),
  });

  return data;
};
