import { runFetchAbortable } from '@/servicios/fetch';
import { ActividadLaboral } from '../(modelos)/actividad-laboral';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarActividadesLaborales = () => {
  return runFetchAbortable<ActividadLaboral[]>(`${apiUrl}actividadlaboral/all`);
};
