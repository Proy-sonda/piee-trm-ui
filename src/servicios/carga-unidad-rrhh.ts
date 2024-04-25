import { PayloadTramitacion } from '@/modelos/payload-tramitacion';
import { DatoEmpleadorUnidad, Unidadesrrhh } from '@/modelos/tramitacion';
import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from './environment';
import { runFetchAbortable } from './fetch';

export const buscarUnidadesDeRRHH = (
  rutEmpleador: string,
): [() => Promise<Unidadesrrhh[]>, () => void] => {
  const payload: PayloadTramitacion = {
    Accion: 2,
    RutEmpleador: rutEmpleador,
    CodigoUnidadRRHH: '',
    RunUsuario: '',
    RunTrabajador: '',
  };

  const [resp, abort] = runFetchAbortable<DatoEmpleadorUnidad>(
    `${urlBackendTramitacion()}/operadores/all/obtieneempleadorrrhhusu`,
    {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  const obtenerUnidad = async () => {
    const unidadrrh: Unidadesrrhh[] = (await resp()).unidadesrrhh;
    return unidadrrh;
  };

  return [obtenerUnidad, abort];
};
