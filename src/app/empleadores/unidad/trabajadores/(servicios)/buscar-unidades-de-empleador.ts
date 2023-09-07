import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';

export const buscarUnidadesDeEmpleador = async (rutempleador: string) => {
  const data = await fetch(`${apiUrl()}/unidad/rutempleador`, {
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
