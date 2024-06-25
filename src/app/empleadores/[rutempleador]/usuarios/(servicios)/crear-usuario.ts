import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { HttpError, runFetchConThrow } from '@/servicios/fetch';
import { FormularioCrearUsuario } from '../(modelos)/formulario-crear-usuario';

interface CrearUsuarioRequest extends FormularioCrearUsuario {
  idEmpleador: number;
  rutEmpleador: string;
}

export class PersonaUsuariaYaExisteError extends Error {}

export const crearUsuario = async (request: CrearUsuarioRequest) => {
  try {
    const payload = {
      rutusuario: request.rut,
      nombres: request.nombres,
      apellidopaterno: request.apellidoPaterno,
      apellidomaterno: request.apellidoMaterno,
      usuarioempleador: [
        {
          email: request.email,
          emailconfirma: request.confirmarEmail,
          telefonouno: request.telefono1,
          telefonodos: request.telefono2,
          empleador: {
            idempleador: request.idEmpleador,
          },
          rol: {
            idrol: request.rolId,
            rol: ' ',
          },
        },
      ],
    };

    await runFetchConThrow<void>(`${apiUrl()}/usuario/create`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error instanceof HttpError && error.body.message === 'Usuario/Empleador ya creado') {
      throw new PersonaUsuariaYaExisteError();
    }

    throw error;
  }
};
