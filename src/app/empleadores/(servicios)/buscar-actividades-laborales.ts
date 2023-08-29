import { runFetch } from '@/servicios/fetch';
import { ActividadLaboral } from '../(modelos)/actividad-laboral';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarActividadesLaborales = async () => {
  return runFetch<ActividadLaboral[]>(fetch(`${apiUrl}actividadlaboral/all`));
};
