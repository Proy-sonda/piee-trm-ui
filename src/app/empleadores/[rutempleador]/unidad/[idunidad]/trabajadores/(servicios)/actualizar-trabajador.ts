import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { Trabajador } from '../(modelos)/trabajador';
import { EmpleadorUnidad } from '../../../(modelos)/payload-unidades';

export const actualizarTrabajador = async (
  { runtrabajador, unidad: { codigounidad } }: Trabajador,
  RunUsuario: string,
  RutEmpleador: string,
) => {
  const payload: EmpleadorUnidad = {
    RunUsuario,
    RutEmpleador,
    trabajadoresxrrhh: {
      acciontraxrrhh: 2,
      codigounidadrrhh: codigounidad,
      runtrabajador,
    },
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
