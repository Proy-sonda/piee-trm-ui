import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { EmpleadorUnidad, Unidadesrrhh } from '../(modelos)/payload-unidades';

export const actualizarUnidad = (
  request: Unidadesrrhh,
  rutEmpleador: string,
  runUsuario: string,
) => {
  request.accionrrhh = 2;
  const payload: EmpleadorUnidad = {
    RunUsuario: runUsuario,
    RutEmpleador: rutEmpleador,
    unidadesrrhh: request,
  };

  return runFetchConThrow<void>(`${urlBackendTramitacion()}/operadores/actualizarrhhusu`, {
    method: 'PUT',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
