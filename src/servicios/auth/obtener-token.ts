import { parseCookies } from 'nookies';
import { ambiente } from '../environment';
import { KEY_TOKEN_AUTENTICACION } from './cookie-autenticacion';

export const KEY_VALIDA_ADSCRIPCION = `${ambiente()}-SevalidaDeAdscripcion`;

/** Solo funciona en client components */
export const obtenerToken = () => {
  const cookie = parseCookies();
  return cookie[KEY_TOKEN_AUTENTICACION];
};

export const obtenerSesionAdscripcion = () => {
  const cookie = parseCookies();
  return cookie[KEY_VALIDA_ADSCRIPCION];
};
