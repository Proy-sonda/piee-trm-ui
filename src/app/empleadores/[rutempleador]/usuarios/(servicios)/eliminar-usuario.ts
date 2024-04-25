import { RespuestaWSOperadores } from '@/modelos/respuesta-ws-operadores';
import { UsuarioToken } from '@/modelos/usuario';
import { WebServiceOperadoresError } from '@/modelos/web-service-operadores-error';
import { obtenerToken } from '@/servicios/auth';
import { apiUrl, urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { PayloadCambiarUsuarioOperadores } from '../(modelos)/payload-cambiar-usuario-operadores';
import { UsuarioEntidadEmpleadora } from '../(modelos)/usuario-entidad-empleadora';

type EliminarUsuarioRequest = UsuarioEntidadEmpleadora & {
  idEmpleador: number;
  rutEmpleador: string;
};

export const eliminarUsuario = async (request: EliminarUsuarioRequest) => {
  try {
    await eliminarUsuarioInterno(request);
  } catch (error) {
    throw error;
  }

  try {
    await eliminarUsuarioConWS(request);
  } catch (error) {
    throw new WebServiceOperadoresError();
  }
};

async function eliminarUsuarioInterno(request: EliminarUsuarioRequest) {
  const payload = {
    idusuario: request.idusuario,
    idempleador: request.idEmpleador,
  };

  return runFetchConThrow<void>(`${apiUrl()}/usuario/idusuario`, {
    method: 'DELETE',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

async function eliminarUsuarioConWS(request: EliminarUsuarioRequest) {
  const token = obtenerToken();

  const payloadOperadores: PayloadCambiarUsuarioOperadores = {
    RunUsuario: UsuarioToken.fromToken(token).rut,
    usuario: {
      accion: 3,
      rutempleador: request.rutEmpleador,
      runusuario: request.rutusuario,
      apellidosusuario: request.apellidos,
      nombresusuario: request.nombres,
      rolusuario: request.usuarioempleadorActual.rol.idrol,
      telefono: request.usuarioempleadorActual.telefonouno,
      telefonomovil: request.usuarioempleadorActual.telefonodos,
      correoelectronicousuario: request.usuarioempleadorActual.email,
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
