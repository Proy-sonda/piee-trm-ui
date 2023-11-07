import { RespuestaWSOperadores } from '@/modelos/respuesta-ws-operadores';
import { UsuarioToken } from '@/modelos/usuario';
import { WebServiceOperadoresError } from '@/modelos/web-service-operadores-error';
import { obtenerToken } from '@/servicios/auth';
import { apiUrl, urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { FormularioEditarUsuario } from '../(modelos)/formulario-editar-usuario';
import { PayloadOperadores } from '../(modelos)/payload-operadores';

interface EditarUsuarioRequest extends FormularioEditarUsuario {
  idUsuario: number;
  rutEmpleador: string;
  estadoUsuarioId: number;
}

export const actualizarUsuario = async (request: EditarUsuarioRequest) => {
  try {
    await actualizarUsuarioInterno(request);
  } catch (error) {
    throw error;
  }

  try {
    await actualizarUsuarioConWS(request);
  } catch (error) {
    throw new WebServiceOperadoresError();
  }
};

async function actualizarUsuarioInterno(request: EditarUsuarioRequest) {
  const payload = {
    idusuario: request.idUsuario,
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
    estadousuario: {
      idestadousuario: request.estadoUsuarioId,
      descripcion: ' ',
    },
  };

  await runFetchConThrow<void>(`${apiUrl()}/usuario/update`, {
    method: 'PUT',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

async function actualizarUsuarioConWS(request: EditarUsuarioRequest) {
  const token = obtenerToken();
  const usuario = UsuarioToken.fromToken(token);

  const payloadOperadores: PayloadOperadores = {
    RunUsuario: usuario.rut,
    usuario: {
      accion: 2,
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
