import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { destroyCookie } from 'nookies';
import { obtenerToken } from './obtener-token';

export const logout = async () => {
  try {
    await runFetchConThrow<void>(`${apiUrl()}/auth/logout`, {
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
    });
  } catch (error) {
    return;
  } finally {
    destroyCookie(null, 'token');
  }
};
