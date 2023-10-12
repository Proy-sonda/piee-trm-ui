import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { destroyCookie } from 'nookies';
import { obtenerToken } from './obtener-token';

/**
 * **NO USAR DIRECTAMENTE. USAR LA QUE VIENE EN EL AuthContext**
 *
 * Elimina cookie con el token de autenticacion
 */
export const desloguearUsuario = async () => {
  try {
    await runFetchConThrow<void>(`${apiUrl()}/auth/logout`, {
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
    });
  } catch (error) {
    // Nada que hacer aca
  } finally {
    destroyCookie({}, 'token', {
      path: '/',
    });
  }
};
