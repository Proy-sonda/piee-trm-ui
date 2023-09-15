import { obtenerToken } from './obtener-token';

/** Solo funciona en client components */
export const estaLogueado = (): boolean => {
  const token = obtenerToken();

  return token !== undefined && token !== null;
};
