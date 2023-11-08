import { RespuestaWSOperadores } from '@/modelos/respuesta-ws-operadores';
import { UsuarioToken } from '@/modelos/usuario';
import { WebServiceOperadoresError } from '@/modelos/web-service-operadores-error';
import { obtenerToken } from '@/servicios/auth';
import { apiUrl, urlBackendTramitacion } from '@/servicios/environment';
import { HttpError, runFetchConThrow } from '@/servicios/fetch';
import { FormularioCrearUsuario } from '../(modelos)/formulario-crear-usuario';
import { PayloadCambiarUsuarioOperadores } from '../(modelos)/payload-cambiar-usuario-operadores';

interface CrearUsuarioRequest extends FormularioCrearUsuario {
  idEmpleador: number;
  rutEmpleador: string;
}

export class PersonaUsuariaYaExisteError extends Error {}

export const crearUsuario = async (request: CrearUsuarioRequest) => {
  try {
    await crearUsuarioInterno(request);
  } catch (error) {
    if (error instanceof HttpError && error.body.message === 'Rut Usuario ya existe') {
      throw new PersonaUsuariaYaExisteError();
    }

    throw error;
  }

  try {
    await crearUsuarioConWS(request);
  } catch (error) {
    throw new WebServiceOperadoresError();
  }
};

async function crearUsuarioInterno(request: CrearUsuarioRequest) {
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

  await runFetchConThrow<void>(`${apiUrl()}/usuario/create`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

async function crearUsuarioConWS(request: CrearUsuarioRequest) {
  const token = obtenerToken();
  const usuario = UsuarioToken.fromToken(token);

  const payloadOperadores: PayloadCambiarUsuarioOperadores = {
    RunUsuario: usuario.rut,
    usuario: {
      accion: 1,
      rutempleador: request.rutEmpleador,
      runusuario: request.rut,
      apellidosusuario: request.apellidos,
      nombresusuario: request.nombres,
      rolusuario: request.rolId,
      telefono: request.telefono1,
      telefonomovil: request.telefono2,
      correoelectronicousuario: request.email,
    },
  };

  const respuesta = await runFetchConThrow<RespuestaWSOperadores>(
    `${urlBackendTramitacion()}/operadores/actualizaempleadorusuario`,
    {
      method: 'PUT',
      headers: {
        Authorization: token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payloadOperadores),
    },
  );

  if (respuesta.estado !== 0) {
    throw new WebServiceOperadoresError(respuesta.gloestado);
  }
}
