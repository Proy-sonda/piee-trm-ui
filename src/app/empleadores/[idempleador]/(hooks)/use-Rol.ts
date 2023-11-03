import { useContext, useEffect, useState } from 'react';
import { EmpleadoresPorUsuarioContext } from '../(contexts)/empleadores-por-usuario';
import { useEmpleadorActual } from '../../(contexts)/empleador-actual-context';

export const useRol = () => {
  const { empleadorActual } = useEmpleadorActual();
  const [RolUsuario, setRolUsuario] = useState<'Administrador' | 'Asistente' | ''>('');
  const { BuscarRolUsuarioEmpleador } = useContext(EmpleadoresPorUsuarioContext);

  useEffect(() => {
    if (empleadorActual == undefined) return;
    const BusquedaRol = async () => {
      const resp = await BuscarRolUsuarioEmpleador(empleadorActual!?.rutempleador);
      setRolUsuario(resp == 'Administrador' ? 'Administrador' : 'Asistente');
    };
    BusquedaRol();
  }, [empleadorActual]);

  return {
    RolUsuario,
  };
};
