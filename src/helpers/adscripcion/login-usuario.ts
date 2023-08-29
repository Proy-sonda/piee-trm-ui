import { UsuarioLogin } from '@/contexts/modelos/types';
import { respLogin } from '@/modelos/adscripcion';

let respuesta: respLogin = {
  data: [],
  message: '',
  statusCode: 0,
};

export const LoginUsuario = async (usuario: UsuarioLogin) => {
  let resp: respLogin;

  try {
    const data = await fetch('http://10.153.106.88:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    if (data.ok) {
      let token = await data.text();

      if (token.includes('Bearer'))
        return {
          resp: {
            message: token,
            statusCode: 200,
          },
        };
    }

    resp = await data.json();

    return {
      resp,
    };
  } catch (error) {
    console.log(error);
  }
};

export const CompruebaToken = async (token: string) => {
  try {
    const resp = await fetch('http://10.153.106.88:3000/auth/islogin', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resp.status == 200) return console.log('token valido');
  } catch (error) {
    console.log('error: ' + error);
  }
};
