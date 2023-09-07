import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { UpdateUnidad } from '../(modelos)/datos-actualizar-unidad';

export const actualizarUnidad = async (unidad: UpdateUnidad) => {
  const data = await fetch(`${apiUrl()}/unidad/update`, {
    method: 'PUT',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(unidad),
  });

  return data;
};
