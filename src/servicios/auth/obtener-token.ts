import { parseCookies } from 'nookies';

/** Solo funciona en client components */
export const obtenerToken = () => {
  const cookie = parseCookies();
  return cookie.token;
};
