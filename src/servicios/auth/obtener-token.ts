import { parseCookies } from 'nookies';

/** Solo funciona en client components */
export const obtenerToken = () => {
  const cookie = parseCookies();
  return cookie.token;
};

export const obtenerSesionAdscripcion = () => {
  const cookie = parseCookies();
  return cookie.SevalidaDeAdscripcion;
};
