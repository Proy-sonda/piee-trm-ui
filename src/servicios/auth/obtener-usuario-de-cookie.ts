import { UsuarioToken } from '@/modelos/usuario';
import { obtenerSesionAdscripcion, obtenerToken } from '.';

/**
 * Restaura al usuario del token guardado en la cookie o `null` si no hay token.
 *
 * **ADVERTENCIA**: Solo funciona en frontend.
 */
export const obtenerUsuarioDeCookie = (): UsuarioToken | null => {
  const token = obtenerToken();

  return !token ? null : UsuarioToken.fromToken(token);
};

export const obtenerValidacionAdscripcion = (): boolean | null => {
  const validaadscripcion = obtenerSesionAdscripcion();

  return !validaadscripcion ? null : true;
};
