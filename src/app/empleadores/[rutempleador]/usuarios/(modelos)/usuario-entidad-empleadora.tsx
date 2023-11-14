import { UsuarioEmpleador } from './usuario-empleador';
import { UsuarioEntidadEmpleadoraAPI } from './usuario-entidad-empleadora-api';

export interface UsuarioEntidadEmpleadora {
  idusuario: number;
  rutusuario: string;
  nombres: string;
  apellidos: string;
  usuarioempleador: UsuarioEmpleador;
}

export const esUsuarioAdministrador = (usuario: UsuarioEntidadEmpleadora) => {
  return usuario.usuarioempleador.rol.idrol === 1;
};

export const esUsuarioAdminHabilitado = (usuario: UsuarioEntidadEmpleadora) => {
  return (
    esUsuarioAdministrador(usuario) &&
    usuario.usuarioempleador.estadousuario.descripcion === 'Habilitado'
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

  return {
    ...usuarioAPI,
    usuarioempleador: usuarioEmpleador,
  } as UsuarioEntidadEmpleadora;
};
