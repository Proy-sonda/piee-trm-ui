import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { useContext, useEffect, useState } from 'react';
import { EmpleadoresPorUsuarioContext } from '../(contexts)/empleadores-por-usuario';
import { useEmpleadorActual } from '../../(contexts)/empleador-actual-context';

export type RolUsuarioHook = 'Administrador' | 'Asistente' | '';

/**
 * _**ADVERTENCIA**_: Al usar la funcion `actualizarRol` solo va a actualizar el rol en el
 * *componente* que invoca al hook, no el de otros componentes.
 */
export const useRol = () => {
  const { empleadorActual } = useEmpleadorActual();
  const [refresh, actualizarRol] = useRefrescarPagina();
  const [RolUsuario, setRolUsuario] = useState<RolUsuarioHook>('');
  const { BuscarRolUsuarioEmpleador } = useContext(EmpleadoresPorUsuarioContext);

  useEffect(() => {
    if (empleadorActual == undefined) return;
    const BusquedaRol = async () => {
      const resp = await BuscarRolUsuarioEmpleador(empleadorActual!?.rutempleador);
      setRolUsuario(resp == 'Administrador' ? 'Administrador' : 'Asistente');
    };
    BusquedaRol();
  }, [empleadorActual, refresh]);

  return {
    RolUsuario,
    actualizarRol,
  };
};
