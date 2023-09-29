import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export const esTokenValido = async (token: string) => {
  try {
    console.log(`${apiUrl()}/auth/islogin`);
    await runFetchConThrow(`${apiUrl()}/auth/islogin`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
