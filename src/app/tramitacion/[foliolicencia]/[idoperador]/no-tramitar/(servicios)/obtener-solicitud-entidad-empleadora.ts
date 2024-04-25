import { runFetchAbortable, urlBackendSuperUsuario } from '@/servicios';
import { SolicitudEntidadEmpleadora } from '../(modelos)/solicitud-entidad-empleadora';

export const ObtenerSolicitudEntidadEmpleadora = () => {
  return runFetchAbortable<SolicitudEntidadEmpleadora[]>(
    `${urlBackendSuperUsuario()}/configuracion/motivonorecepcion/all`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
