

import { createContext } from 'react';
import { ChildrenApp } from "./interfaces/types";
import {useState} from 'react';

import { DatoEmpleador } from '../empleadores/interface/datoEmpleador';

type EmpleadorContextType = {
    empleador: DatoEmpleador[];
    cargaEmpleador: (empleador: DatoEmpleador[]) => void
}


export const EmpleadorContext = createContext<EmpleadorContextType>({
    empleador:[],
    cargaEmpleador:()=> {}

});

export const EmpleadorProvider: React.FC<ChildrenApp> = ({children}) => {


    const [empleador, setempleador] = useState<DatoEmpleador[]>([])

    
    const cargaEmpleador = (empleador: DatoEmpleador[]) => {

        
        
        if(empleador.length > 0) return setempleador(empleador);
    }



    return (
        <EmpleadorContext.Provider value={
            {
                empleador,
                cargaEmpleador
            }

        } >
            {children}

        </EmpleadorContext.Provider>
    )
}