import { runFetchAbortable, urlBackendSuperUsuario } from '@/servicios';
import { CalidadPersonaTrabajadora } from '../(modelos)/calidad-persona-trabajadora';

export const ObtenerConfiguracionCalidadPersona = () => {
  return runFetchAbortable<CalidadPersonaTrabajadora[]>(
    `${urlBackendSuperUsuario()}/configuracion/relacion/all`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
