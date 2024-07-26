import { parseCookies } from 'nookies';
import { KEY_TOKEN_AUTENTICACION } from './cookie-autenticacion';

/** Solo funciona en client components */
export const obtenerToken = () => {
  const cookie = parseCookies();
  return cookie[KEY_TOKEN_AUTENTICACION];
};
