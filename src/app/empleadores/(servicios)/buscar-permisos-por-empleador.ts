import { FetchResponse } from '@/hooks/use-merge-fetch';
import { buscarUsuarioPorRut } from '@/servicios/buscar-usuario-por-rut';
import { PermisoPorEmpleador } from '../(modelos)/permiso-por-empleador';

export const buscarPermisosPorEmpleador = (
  rutUsuario: string,
): FetchResponse<PermisoPorEmpleador[]> => {
  const [req, abortador] = buscarUsuarioPorRut(rutUsuario);

  const nuevoRequest = async (): Promise<PermisoPorEmpleador[]> => {
    const usuarioCompleto = await req();

    if (!usuarioCompleto) {
      return [];
    }

    return usuarioCompleto.usuarioempleador.map(({ empleador, rol }) => ({
      rutEmpleador: empleador.rutempleador,
      rol: rol.idrol === 1 ? 'administrador' : 'asistente',
    }));
  };

  return [nuevoRequest, abortador];
};
