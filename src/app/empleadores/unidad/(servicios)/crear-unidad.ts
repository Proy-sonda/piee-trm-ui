import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { CrearUnidad } from '../(modelos)/datos-nueva-unidad';

export const crearUnidad = async (unidad: CrearUnidad) => {
  const data = await fetch(`${apiUrl()}/unidad/create`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(unidad),
  });
  return data;
};
