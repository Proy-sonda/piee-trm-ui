import { obtenerToken } from '@/servicios/auth';
import { DatosNuevoTrabajador } from '../(modelos)/datos-nuevo-trabajador';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const crearTrabajador = async (trabajador: DatosNuevoTrabajador) => {
  const data = await fetch(`${api_url}trabajador/create`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(trabajador),
  });

  return data;
};
