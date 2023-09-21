import { DatoEmpleador } from '@/modelos/dato-empleador';
import { ReactNode, createContext, useState } from 'react';

type EmpleadorContextType = {
  empleador: DatoEmpleador[];
  cargaEmpleador: (empleador: DatoEmpleador[]) => void;
};

export const EmpleadorContext = createContext<EmpleadorContextType>({
  empleador: [],
  cargaEmpleador: () => {},
});

export const EmpleadorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
