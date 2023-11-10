'use client';

import { AuthContext } from '@/contexts';
import { createContext, ReactNode, useContext, useState } from 'react';
import { UsuarioEntidadEmpleadora } from '../usuarios/(modelos)/usuario-entidad-empleadora';
import { buscarUsuarios } from '../usuarios/(servicios)/buscar-usuarios';

type EmpleadoresPorUsuarioContextType = {
  errorCargarEmpleadores?: boolean;
  empleadores?: UsuarioEntidadEmpleadora;
  BuscarRolUsuarioEmpleador: (rutEmpleador: string) => Promise<string>;
};

export const EmpleadoresPorUsuarioContext = createContext<EmpleadoresPorUsuarioContextType>({
  BuscarRolUsuarioEmpleador: (rutEmpleador: string) => new Promise<string>((resp) => {}),
});

export const EmpleadorPorUsuarioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { usuario } = useContext(AuthContext);
  const [errorCargarEmpleadores, seterrorCargarEmpleadores] = useState(false);
  const [EmpleadoresPorUsuario, setEmpleadoresPorUsuario] = useState<UsuarioEntidadEmpleadora>();

  const BuscarRolUsuarioEmpleador = async (rutEmpleador: string) => {
    if (rutEmpleador == '') return '';
    const [resp] = await buscarUsuarios(rutEmpleador);
    const empleadores: UsuarioEntidadEmpleadora | undefined = (await resp()).find(
      ({ rutusuario }) => rutusuario == usuario?.rut,
    );
    if (!empleadores) seterrorCargarEmpleadores(true);
    setEmpleadoresPorUsuario(empleadores);
    return empleadores?.rol.rol || '';
  };

  return (
    <EmpleadoresPorUsuarioContext.Provider
      value={{
        empleadores: EmpleadoresPorUsuario,
        errorCargarEmpleadores,
        BuscarRolUsuarioEmpleador,
      }}>
      {children}
    </EmpleadoresPorUsuarioContext.Provider>
  );
};
