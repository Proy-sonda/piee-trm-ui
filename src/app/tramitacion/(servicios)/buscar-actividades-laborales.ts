import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { ActividadLaboral } from '../(modelos)/actividad-laboral';

export const buscarActividadesLaborales = () => {
  return runFetchAbortable<ActividadLaboral[]>(`${urlBackendTramitacion()}/actividadlaboral/all`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
};
