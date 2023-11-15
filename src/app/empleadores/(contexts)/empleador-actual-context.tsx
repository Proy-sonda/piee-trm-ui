'use client';

import { AuthContext } from '@/contexts';
import { useFetch } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { Empleador } from '@/modelos/empleador';
import { buscarUsuarioPorRut } from '@/servicios/buscar-usuario-por-rut';
import { FetchError, emptyFetch } from '@/servicios/fetch';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { RolUsuarioEnEmpleador } from '../(modelos)/rol-usuario-en-empleador';
import { buscarEmpleadorRut } from '../(servicios)/buscar-empleador-rut';

type EmpleadorContextType = {
  rolEnEmpleadorActual?: RolUsuarioEnEmpleador;
  cargandoEmpleador: boolean;
  empleadorActual?: Empleador;
  errorCargarEmpleador?: FetchError;
  refrescarEmpleador: () => void;
  actualizarRol: () => void;
  cambiarEmpleador: (rutEmpleador: string) => void;
};

const EmpleadorActualContext = createContext<EmpleadorContextType>({
  cargandoEmpleador: false,
  refrescarEmpleador: () => {},
  cambiarEmpleador: () => {},
  actualizarRol: () => {},
});

export const useEmpleadorActual = () => {
  return useContext(EmpleadorActualContext);
};

export const EmpleadorActualProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [refresh, refrescarEmpleador] = useRefrescarPagina();

  const [rutEmpleador, setRutEmpleador] = useState<string | null>(null);

  const [errorCargarEmpleador, empleadorActual, cargandoEmpleador] = useFetch(
    rutEmpleador ? buscarEmpleadorRut(rutEmpleador) : emptyFetch(),
    [refresh, rutEmpleador],
  );

  const { usuario } = useContext(AuthContext);

  const [refreshRol, actualizarRol] = useRefrescarPagina();

  const [, usuarioCompleto] = useFetch(usuario ? buscarUsuarioPorRut(usuario.rut) : emptyFetch(), [
    refreshRol,
    usuario,
  ]);

  const [rolEnEmpleadorActual, setRolEnEmpleadorActual] = useState<RolUsuarioEnEmpleador>();

  // Buscar el rol del usuario en la empresa actual
  useEffect(() => {
    if (!usuarioCompleto || !empleadorActual) {
      setRolEnEmpleadorActual(undefined);
      return;
    }

    const usuarioEmpleador = usuarioCompleto.usuarioempleador.find(
      (x) => x.empleador.rutempleador === empleadorActual.rutempleador,
    );

    if (!usuarioEmpleador) {
      setRolEnEmpleadorActual(undefined);
    } else if (usuarioEmpleador.rol.idrol === 1) {
      setRolEnEmpleadorActual('administrador');
    } else {
      setRolEnEmpleadorActual('asistente');
    }
  }, [refreshRol, usuarioCompleto, empleadorActual]);

  const cambiarEmpleador = (rutEmpleador: string) => {
    setRutEmpleador(rutEmpleador);
  };

  return (
    <EmpleadorActualContext.Provider
      value={{
        rolEnEmpleadorActual,
        cargandoEmpleador,
        empleadorActual,
        errorCargarEmpleador,
        refrescarEmpleador,
        cambiarEmpleador,
        actualizarRol,
      }}>
      {children}
    </EmpleadorActualContext.Provider>
  );
};
