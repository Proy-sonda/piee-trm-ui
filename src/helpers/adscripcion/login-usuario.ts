import { apiUrl } from '@/servicios/environment';

export const CompruebaToken = async (token: string) => {
  try {
    const resp = await fetch(`${apiUrl()}/auth/islogin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resp.status == 200) return console.log('token valido');
  } catch (error) {
    console.log('error: ' + error);
  }
};
