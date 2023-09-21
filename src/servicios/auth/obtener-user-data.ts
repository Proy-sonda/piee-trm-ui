import { UserData } from '@/modelos/user-data';
import jwtDecode from 'jwt-decode';
import { obtenerToken } from '.';

/** Obtiene los datos del usuario del token o `null` si no hay token. */
export const obtenerUserData = (): UserData | null => {
  const token = obtenerToken();

  if (!token) {
    return null;
  }

  return jwtDecode(token) as UserData;
};
