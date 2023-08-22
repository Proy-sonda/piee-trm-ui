import {
  CCACTLABCB,
  CCAFCB,
  CCCOMUNACB,
  CCREGIONCB,
  CCREMUNERACION,
  CCTAMANOCB,
  CCTIPOEM,
} from '@/app/contexts/interfaces/types';
import { runFetch } from '@/app/servicios/fetch';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarTiposDeEmpleadores = async () => {
  return runFetch<CCTIPOEM[]>(fetch(`${apiUrl}tipoempleador/all`));
};

export const buscarComunas = async () => {
  return runFetch<CCCOMUNACB[]>(fetch(`${apiUrl}comuna/all/region`));
};

export const buscarCajasDeCompensacion = async () => {
  return runFetch<CCAFCB[]>(fetch(`${apiUrl}ccaf/all`));
};

export const buscarRegiones = async () => {
  return runFetch<CCREGIONCB[]>(fetch(`${apiUrl}Region/all`));
};

export const buscarActividadesLaborales = async () => {
  return runFetch<CCACTLABCB[]>(fetch(`${apiUrl}actividadlaboral/all`));
};

export const buscarSistemasDeRemuneracion = async () => {
  return runFetch<CCREMUNERACION[]>(fetch(`${apiUrl}sistemaremuneracion/all`));
};

export const buscarTamanosEmpresa = async () => {
  return runFetch<CCTAMANOCB[]>(fetch(`${apiUrl}tamanoempresa/all`));
};
