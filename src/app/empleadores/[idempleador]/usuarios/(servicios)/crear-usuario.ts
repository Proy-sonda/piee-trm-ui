import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { HttpError, runFetchConThrow } from '@/servicios/fetch';

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

export class PersonaUsuariaYaExisteError extends Error {}

export const crearUsuario = async (datosUsuario: CrearUsuarioRequest) => {
  try {
    await runFetchConThrow<void>(`${apiUrl()}/usuario/create`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(datosUsuario),
    });
  } catch (error) {
    if (error instanceof HttpError && error.body.message === 'Rut Usuario ya existe') {
      throw new PersonaUsuariaYaExisteError();
    }

    throw error;
  }
};
