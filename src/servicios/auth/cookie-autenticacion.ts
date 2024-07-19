import { UsuarioToken } from '@/modelos/usuario';
import { ambiente } from '@/servicios/environment';
import { obtenerDominio } from '@/utilidades';
import { destroyCookie, setCookie } from 'nookies';

export const KEY_TOKEN_AUTENTICACION = `${ambiente()}-token`;

export const setearCookieAutenticacion = (token: string) => {
  const usuario = UsuarioToken.fromToken(token);

  setCookie(null, KEY_TOKEN_AUTENTICACION, token, {
    maxAge: usuario.vigenciaToken(),
    path: '/',
    domain: obtenerDominio(window.location),
  });
};

export const destruirCookieAutenticacion = () => {
  destroyCookie({}, KEY_TOKEN_AUTENTICACION, {
    path: '/',
    domain: obtenerDominio(window.location),
  });
};
