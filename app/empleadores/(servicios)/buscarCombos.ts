import {
  CCACTLABCB,
  CCAFCB,
  CCCOMUNACB,
  CCREGIONCB,
  CCREMUNERACION,
  CCTAMANOCB,
  CCTIPOEM,
} from '@/app/contexts/interfaces/types';
import { useFetch } from '@/app/hooks/useFetch';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const useBuscarTiposDeEmpleadores = () => {
  return useFetch<CCTIPOEM[]>(`${apiUrl}tipoempleador/all`);
};

export const useBuscarComunas = () => {
  return useFetch<CCCOMUNACB[]>(`${apiUrl}comuna/all/region`);
};

export const useBuscarCajasDeCompensacion = () => {
  return useFetch<CCAFCB[]>(`${apiUrl}ccaf/all`);
};

export const useBuscarRegiones = () => {
  return useFetch<CCREGIONCB[]>(`${apiUrl}Region/all`);
};

export const useBuscarActividadesLaborales = () => {
  return useFetch<CCACTLABCB[]>(`${apiUrl}actividadlaboral/all`);
};

export const useBuscarSistemasDeRemuneracion = () => {
  return useFetch<CCREMUNERACION[]>(`${apiUrl}sistemaremuneracion/all`);
};

export const useBuscarTamanosEmpresa = () => {
  return useFetch<CCTAMANOCB[]>(`${apiUrl}tamanoempresa/all`);
};
