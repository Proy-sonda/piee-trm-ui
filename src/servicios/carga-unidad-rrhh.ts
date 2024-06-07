import { PayloadTramitacion } from '@/modelos/payload-tramitacion';
import { DatoEmpleadorUnidad, Unidadesrrhh } from '@/modelos/tramitacion';
import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from './environment';
import { runFetchAbortable } from './fetch';

export const buscarUnidadesDeRRHH = (
  rutEmpleador: string,
  operador?:number,
  CodigoUnidadRRHH?: string,
): [() => Promise<Unidadesrrhh[]>, () => void] => {
  
  let payload: PayloadTramitacion = {
    Accion: 2,
    RutEmpleador: rutEmpleador,
    CodigoUnidadRRHH: CodigoUnidadRRHH || '',
    RunUsuario: '',
    RunTrabajador: '',
    Operador: operador || 0,
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
