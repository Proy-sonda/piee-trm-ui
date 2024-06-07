import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { EmpleadorUnidad, Usuarioxrrhh } from '../../../(modelos)/payload-unidades';

export const eliminarUsuarioAsociado = (
  usuarioxrrhh: Usuarioxrrhh,
  RunUsuario: string,
  RutEmpleador: string,
  operador:number,
) => {
  const payload: EmpleadorUnidad = {
    RunUsuario,
    RutEmpleador,
    usuarioxrrhh,
    operador
      
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
