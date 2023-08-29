import { parseCookies } from 'nookies';

export const obtenerToken = () => {
  const cookie = parseCookies();
  return cookie.token;
};

export const estaLogueado = (): boolean => {
  const token = obtenerToken();

  return token !== undefined && token !== null;
};
