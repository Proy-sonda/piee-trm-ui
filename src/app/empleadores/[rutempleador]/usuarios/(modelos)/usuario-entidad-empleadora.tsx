import { UsuarioEmpleador } from '@/modelos/usuario-empleador';
import { UsuarioEntidadEmpleadoraAPI } from '@/modelos/usuario-entidad-empleadora-api';

export interface UsuarioEntidadEmpleadora {
  idusuario: number;
  rutusuario: string;
  nombres: string;
  apellidos: string;
  /** Todos los empleadores a los que pertenece el usuario. */
  usuarioempleador: UsuarioEmpleador[];

  /** El empleador del usuario que esta seleccionado actualmente */
  usuarioempleadorActual: UsuarioEmpleador;
}

export const esUsuarioAdministrador = (usuario: UsuarioEntidadEmpleadora) => {
  return usuario.usuarioempleadorActual.rol.idrol === 1;
};

export const esUsuarioAdminHabilitado = (usuario: UsuarioEntidadEmpleadora) => {
  return (
    esUsuarioAdministrador(usuario) &&
    usuario.usuarioempleadorActual.estadousuario.descripcion === 'Habilitado'
  );
};

/** Devuelve `undefined` cuando el usuario no pertenece al empleador */
export const usuarioEntidadEmpleadoraDesdeApi = (
  usuarioAPI: UsuarioEntidadEmpleadoraAPI,
  rutEmpleador: string,
) => {
  const usuarioEmpleador = usuarioAPI.usuarioempleador.find(
    (ue) => ue.empleador.rutempleador === rutEmpleador,
  );

  if (!usuarioEmpleador) {
    return undefined;
  }

  /* Aqui se aprovecha de reparar posibles valores nulos que vengan desde el backend */
  return {
    ...usuarioAPI,
    usuarioempleadorActual: {
      empleador: usuarioEmpleador.empleador,
      estadousuario: usuarioEmpleador.estadousuario,
      rol: usuarioEmpleador.rol,
      email: usuarioEmpleador.email ?? '',
      telefonouno: usuarioEmpleador.telefonouno ?? '',
      telefonodos: usuarioEmpleador.telefonodos ?? '',
      idusuarioempleador: usuarioEmpleador.idusuarioempleador,
    },
  } as UsuarioEntidadEmpleadora;
};
