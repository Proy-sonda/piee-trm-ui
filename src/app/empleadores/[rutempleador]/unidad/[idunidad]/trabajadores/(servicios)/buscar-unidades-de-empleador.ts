import { PayloadTramitacion } from '@/modelos/payload-tramitacion';
import { DatoEmpleadorUnidad, Unidadesrrhh } from '@/modelos/tramitacion';
import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';

export const buscarUnidadesDeEmpleador = (
  RutEmpleador: string,
  CodigoUnidadRRHH: string,
): [() => Promise<Unidadesrrhh[] | undefined>, () => void] => {
  const payload: PayloadTramitacion = {
    Accion: 2,
    RutEmpleador,
    CodigoUnidadRRHH,
    RunTrabajador: '',
    RunUsuario: '',
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

  const buscarUnidad = async () => {
    const unidadrrhh: Unidadesrrhh[] | undefined = (await resp()).unidadesrrhh;
    return unidadrrhh;
  };

  return [buscarUnidad, abort];
};
