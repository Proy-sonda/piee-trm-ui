import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { calidadTrabajador } from '../(modelo)/calidad-trabajador';

export const buscarCalidadTrabajador = () => {
  return runFetchAbortable<calidadTrabajador[]>(
    `${urlBackendTramitacion()}/calidadtrabajador/all`,
    {
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
    },
  );
};
