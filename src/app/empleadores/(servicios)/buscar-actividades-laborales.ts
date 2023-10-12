import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { ActividadLaboral } from '../(modelos)/actividad-laboral';

export const buscarActividadesLaborales = () => {
  return runFetchAbortable<ActividadLaboral[]>(`${apiUrl()}/actividadlaboral/all`);
};
