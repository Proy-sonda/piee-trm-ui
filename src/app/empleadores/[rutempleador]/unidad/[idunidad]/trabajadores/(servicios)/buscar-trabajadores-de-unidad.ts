import { PayloadTramitacion } from '@/modelos/payload-tramitacion';
import { DatoEmpleadorUnidad, Trabajadoresunidadrrhh } from '@/modelos/tramitacion';
import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';

export const buscarTrabajadoresDeUnidad = (
  idunidad: string,
  rutempleador: string,
): [() => Promise<Trabajadoresunidadrrhh[]>, () => void] => {
  const payLoad: PayloadTramitacion = {
    Accion: 4,
    CodigoUnidadRRHH: idunidad,
    RunTrabajador: '',
    RunUsuario: '',
    RutEmpleador: rutempleador,
  };

  const [resp, abort] = runFetchAbortable<DatoEmpleadorUnidad>(
    `${urlBackendTramitacion()}/operadores/all/obtieneempleadorrrhhusu`,
    {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payLoad),
    },
  );

  const buscarTrabajador = async () => {
    const Trabajadoresunidadrrhh = (await resp()).trabajadoresunidadrrhh;
    return Trabajadoresunidadrrhh;
  };

  return [buscarTrabajador, abort];
};
