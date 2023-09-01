import { obtenerToken } from '@/servicios/auth';
import { runFetch } from '@/servicios/fetch';
import { Empleadorusu } from '../(modelos)/iempleadorusu';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const buscarEmpleadorRut = (rut: string) => {
  return runFetch<Empleadorusu>(
    fetch(`${api_url}empleador/rutempleador`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        rutempleador: rut,
      }),
    }),
  );
};
