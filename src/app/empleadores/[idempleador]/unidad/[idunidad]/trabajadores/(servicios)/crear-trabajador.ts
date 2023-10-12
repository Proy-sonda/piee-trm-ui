import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { DatosNuevoTrabajador } from '../(modelos)/datos-nuevo-trabajador';

export const crearTrabajador = async (trabajador: DatosNuevoTrabajador) => {
  const data = await fetch(`${apiUrl()}/trabajador/create`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(trabajador),
  });

  return data;
};
