

import { urlBackendSuperUsuario } from '@/servicios';
import { Configuracion } from '../(modelos)/configuracion';
import { runFetchAbortable } from '@/servicios/fetch';


export const ObtenerConfiguracion = () => {
  return runFetchAbortable<Configuracion[]>(`${urlBackendSuperUsuario()}/configuracion/all`,
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },);
};
