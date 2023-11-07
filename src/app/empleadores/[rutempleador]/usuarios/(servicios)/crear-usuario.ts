import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { HttpError, runFetchConThrow } from '@/servicios/fetch';
import { FormularioCrearUsuario } from '../(modelos)/formulario-crear-usuario';

interface CrearUsuarioRequest extends FormularioCrearUsuario {
  idEmpleador: number;
}

export class PersonaUsuariaYaExisteError extends Error {}

export const crearUsuario = async (request: CrearUsuarioRequest) => {
  const payload = {
    rutusuario: request.rut,
    nombres: request.nombres,
    apellidos: request.apellidos,
    email: request.email,
    emailconfirma: request.confirmarEmail,
    telefonouno: request.telefono1,
    telefonodos: request.telefono2,
    rol: {
      idrol: request.rolId,
      rol: ' ',
    },
    usuarioempleador: [
      {
        empleador: {
          idempleador: request.idEmpleador,
        },
      },
    ],
  };

  try {
    await runFetchConThrow<void>(`${apiUrl()}/usuario/create`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error instanceof HttpError && error.body.message === 'Rut Usuario ya existe') {
      throw new PersonaUsuariaYaExisteError();
    }

    throw error;
  }
};
