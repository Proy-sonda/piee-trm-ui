import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from './environment';

export const cargaUnidadrrhh = async (rutempleador: string) => {
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
  let resp = await data.json();
  return resp;
};
