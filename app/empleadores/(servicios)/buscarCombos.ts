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

export const useBuscarTiposDeEmpleadores = () => {
  return useFetch<CCTIPOEM[]>('http://10.153.106.88:3000/tipoempleador/all');
};

export const useBuscarComunas = () => {
  return useFetch<CCCOMUNACB[]>('http://10.153.106.88:3000/comuna/all/region');
};

export const useBuscarCajasDeCompensacion = () => {
  return useFetch<CCAFCB[]>('http://10.153.106.88:3000/ccaf/all');
};

export const useBuscarRegiones = () => {
  return useFetch<CCREGIONCB[]>('http://10.153.106.88:3000/Region/all');
};
export const useBuscarActividadesLaborales = () => {
  return useFetch<CCACTLABCB[]>('http://10.153.106.88:3000/actividadlaboral/all');
};
export const useBuscarSistemasDeRemuneracion = () => {
  return useFetch<CCREMUNERACION[]>('http://10.153.106.88:3000/sistemaremuneracion/all');
};
export const useBuscarTamanosEmpresa = () => {
  return useFetch<CCTAMANOCB[]>('http://10.153.106.88:3000/tamanoempresa/all');
};
