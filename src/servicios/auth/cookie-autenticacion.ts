import { UsuarioToken } from '@/modelos/usuario';
import { obtenerDominio } from '@/utilidades';
import { destroyCookie, setCookie } from 'nookies';

export const setearCookieAutenticacion = (token: string) => {
  const usuario = UsuarioToken.fromToken(token);

  setCookie(null, 'token', token, {
    maxAge: usuario.vigenciaToken(),
    path: '/',
    domain: obtenerDominio(window.location),
  });
};

export const destruirCookieAutenticacion = () => {
  destroyCookie({}, 'token', {
    path: '/',
    domain: obtenerDominio(window.location),
  });
};
