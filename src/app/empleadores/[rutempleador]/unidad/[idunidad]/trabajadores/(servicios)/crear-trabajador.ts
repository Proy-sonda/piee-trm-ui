import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';

import { EmpleadorUnidad, Trabajadoresxrrhh } from '../../../(modelos)/payload-unidades';

export const crearTrabajador = async (
  trabajadoresxrrhh: Trabajadoresxrrhh,
  RunUsuario: string,
  RutEmpleador: string,
  operador:number,
) => {
  trabajadoresxrrhh.acciontraxrrhh = 1;
  const payload: EmpleadorUnidad = {
    RunUsuario,
    RutEmpleador,
    trabajadoresxrrhh,
    operador
  };
  const data = await fetch(`${urlBackendTramitacion()}/operadores/actualizarrhhusu`, {
    method: 'PUT',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return data;
};
