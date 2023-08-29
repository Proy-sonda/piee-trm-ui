import { obtenerToken } from '@/servicios/auth';
import { runFetchConThrow } from '@/servicios/fetch';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface CrearUsuarioRequest {
  rutusuario: string;
  nombres: string;
  apellidos: string;
  email: string;
  emailconfirma: string;
  telefonouno: string;
  telefonodos: string;
  rol: {
    idrol: number;
    rol: string;
  };
  usuarioempleador: {
    empleador: {
      idempleador: number;
    };
  }[];
}

export const crearUsuario = (datosUsuario: CrearUsuarioRequest) => {
  return runFetchConThrow<void>(
    fetch(`${apiUrl}usuario/create`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(datosUsuario),
    }),
  );
};
