import { Empleador } from '@/modelos/empleador';
import { RespuestaWSOperadores } from '@/modelos/respuesta-ws-operadores';
import { UsuarioToken } from '@/modelos/usuario';
import { WebServiceOperadoresError } from '@/modelos/web-service-operadores-error';
import { obtenerToken } from '@/servicios/auth';
import { apiUrl, urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { FormularioEditarUsuario } from '../(modelos)/formulario-editar-usuario';
import { PayloadCambiarUsuarioOperadores } from '../(modelos)/payload-cambiar-usuario-operadores';
import { UsuarioEntidadEmpleadora } from '../(modelos)/usuario-entidad-empleadora';

interface EditarUsuarioRequest extends FormularioEditarUsuario {
  usuarioOriginal: UsuarioEntidadEmpleadora;
  empleador: Empleador;
}

/**
 * **IMPORTANTE**: Este endpoint siempre va a habilitar al usuario, independiente de si esta
 * habilitado o no.
 */
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

async function actualizarUsuarioInterno({ usuarioOriginal, ...request }: EditarUsuarioRequest) {
  const payload = {
    idusuario: usuarioOriginal.idusuario,
    rutusuario: request.rut,
    nombres: request.nombres,
    apellidopaterno: request.apellidoPaterno,
    apellidomaterno: request.apellidoMaterno,
    usuarioempleador: [
      {
        idusuarioempleador: usuarioOriginal.usuarioempleadorActual.idusuarioempleador,
        email: request.email,
        emailconfirma: request.confirmarEmail,
        telefonouno: request.telefono1,
        telefonodos: request.telefono2,
        empleador: {
          idempleador: request.empleador.idempleador,
        },
        rol: {
          idrol: request.rolId,
          rol: ' ',
        },
        estadousuario: {
          idestadousuario: 1, // 1 = Habilitado
          descripcion: ' ',
        },
      },
    ],
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

  const payloadOperadores: PayloadCambiarUsuarioOperadores = {
    RunUsuario: usuario.rut,
    usuario: {
      accion: 2,
      rutempleador: request.empleador.rutempleador,
      runusuario: request.rut,
      apellidosusuario: `${request.apellidoPaterno} ${request.apellidoMaterno}`,
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
