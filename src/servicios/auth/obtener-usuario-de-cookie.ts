import { UsuarioToken } from '@/modelos/usuario';
import { obtenerToken } from '.';

/**
 * Obtiene los datos del usuario del token o `null` si no hay token.
 *
 * **ADVERTENCIA**: Solo funciona en frontend.
 */
export const obtenerUsuarioDeCookie = (): UsuarioToken | null => {
  const token = obtenerToken();

  return !token ? null : UsuarioToken.fromToken(token);
};
