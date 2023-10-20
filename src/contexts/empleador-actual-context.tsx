'use client';

import { EmpleadorPorId } from '@/app/empleadores/[idempleador]/datos/(modelos)/empleador-por-id';
import { buscarEmpleadorPorId } from '@/app/empleadores/[idempleador]/datos/(servicios)/buscar-empleador-por-id';
import { useFetch } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { FetchError, emptyFetch } from '@/servicios/fetch';
import { ReactNode, createContext, useContext, useState } from 'react';

type EmpleadorContextType = {
  cargandoEmpleador: boolean;
  empleadorActual?: EmpleadorPorId;
  errorCargarEmpleador?: FetchError;
  refrescarEmpleador: () => void;
  cambiarEmpleador: (empleadorId: number) => void;
};

const EmpleadorActualContext = createContext<EmpleadorContextType>({
  cargandoEmpleador: false,
  refrescarEmpleador: () => {},
  cambiarEmpleador: () => {},
});

export const useEmpleadorActual = () => {
  return useContext(EmpleadorActualContext);
};

export const EmpleadorActualProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [refresh, refrescarEmpleador] = useRefrescarPagina();

  const [idEmpleador, setIdEmpleador] = useState<number | null>(null);

  const [errorCargarEmpleador, empleadorActual, cargandoEmpleador] = useFetch(
    idEmpleador ? buscarEmpleadorPorId(idEmpleador) : emptyFetch(),
    [refresh, idEmpleador],
  );

  const cambiarEmpleador = (empleadorId: number) => {
    setIdEmpleador(empleadorId);
  };

  return (
    <EmpleadorActualContext.Provider
      value={{
        cargandoEmpleador,
        empleadorActual,
        errorCargarEmpleador,
        refrescarEmpleador,
        cambiarEmpleador,
      }}>
      {children}
    </EmpleadorActualContext.Provider>
  );
};
