import { Empleador } from '@/modelos/empleador';
import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { FormularioEditarUsuario } from '../(modelos)/formulario-editar-usuario';
import { UsuarioEntidadEmpleadora } from '../(modelos)/usuario-entidad-empleadora';

interface EditarUsuarioRequest extends FormularioEditarUsuario {
  usuarioOriginal: UsuarioEntidadEmpleadora;
  empleador: Empleador;
}

/**
 * **IMPORTANTE**: Este endpoint siempre va a habilitar al usuario, independiente de si esta
 * habilitado o no.
 */
export const actualizarUsuario = async ({ usuarioOriginal, ...request }: EditarUsuarioRequest) => {
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
};
