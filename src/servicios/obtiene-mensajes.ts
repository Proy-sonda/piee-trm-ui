import { Mensaje } from '@/modelos/mensaje';
import { urlBackendSuperUsuario } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';

export const obtenerMensajes = () => {
  return runFetchAbortable<Mensaje[]>(`${urlBackendSuperUsuario()}/mensajegeneral/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
