import { DatoEmpleador } from '@/modelos/dato-empleador';
import { createContext, useState } from 'react';
import { ChildrenApp } from './interfaces/types';

type EmpleadorContextType = {
  empleador: DatoEmpleador[];
  cargaEmpleador: (empleador: DatoEmpleador[]) => void;
};

export const EmpleadorContext = createContext<EmpleadorContextType>({
  empleador: [],
  cargaEmpleador: () => {},
});

export const EmpleadorProvider: React.FC<ChildrenApp> = ({ children }) => {
  const [empleador, setempleador] = useState<DatoEmpleador[]>([]);

  const cargaEmpleador = (empleador: DatoEmpleador[]) => {
    if (empleador.length > 0) return setempleador(empleador);
  };

  return (
    <EmpleadorContext.Provider
      value={{
        empleador,
        cargaEmpleador,
      }}>
      {children}
    </EmpleadorContext.Provider>
  );
};
