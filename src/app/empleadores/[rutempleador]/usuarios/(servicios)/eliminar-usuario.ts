import { RespuestaWSOperadores } from '@/modelos/respuesta-ws-operadores';
import { UsuarioToken } from '@/modelos/usuario';
import { WebServiceOperadoresError } from '@/modelos/web-service-operadores-error';
import { obtenerToken } from '@/servicios/auth';
import { apiUrl, urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { PayloadOperadores } from '../(modelos)/payload-operadores';
import { UsuarioEntidadEmpleadora } from '../(modelos)/usuario-entidad-empleadora';

type EliminarUsuarioRequest = UsuarioEntidadEmpleadora & {
  rutEmpleador: string;
};

export const eliminarUsuario = async (usuario: EliminarUsuarioRequest) => {
  try {
    await eliminarUsuarioInterno(usuario.idusuario);
  } catch (error) {
    throw error;
  }

  try {
    await eliminarUsuarioConWS(usuario);
  } catch (error) {
    throw new WebServiceOperadoresError();
  }
};

async function eliminarUsuarioInterno(idUsuario: number) {
  return runFetchConThrow<void>(`${apiUrl()}/usuario/idusuario`, {
    method: 'DELETE',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idusuario: idUsuario,
    }),
  });
}

async function eliminarUsuarioConWS(request: EliminarUsuarioRequest) {
  const token = obtenerToken();

  const payloadOperadores: PayloadOperadores = {
    RunUsuario: UsuarioToken.fromToken(token).rut,
    usuario: {
      accion: 3,
      rutempleador: request.rutEmpleador,
      runusuario: request.rutusuario,
      apellidosusuario: request.apellidos,
      nombresusuario: request.nombres,
      rolusuario: request.rol.idrol,
      telefono: request.telefonouno,
      telefonomovil: request.telefonodos,
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
