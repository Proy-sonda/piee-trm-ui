import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export const esTokenValido = async (token: string) => {
  try {
    await runFetchConThrow(`${apiUrl()}/auth/islogin`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
};
