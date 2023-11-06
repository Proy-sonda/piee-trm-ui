import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { EmpleadorUnidad, Unidadesrrhh } from '../(modelos)/payload-unidades';

export const eliminarUnidad = (
  unidadesrrhh: Unidadesrrhh,
  RutEmpleador: string,
  RunUsuario: string,
) => {
  const payload: EmpleadorUnidad = {
    RunUsuario,
    RutEmpleador,
    unidadesrrhh,
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
