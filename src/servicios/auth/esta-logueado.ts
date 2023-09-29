import { obtenerToken } from './obtener-token';

/**
 * @deprecated
 * Se puede eliminar solo si se resuelve el problema con el login
 * Solo funciona en client components */
export const estaLogueado = (): boolean => {
  const token = obtenerToken();

  return token !== undefined && token !== null;
};
