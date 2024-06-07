import { PayloadTramitacion } from '@/modelos/payload-tramitacion';
import { DatoEmpleadorUnidad, Unidadesrrhh } from '@/modelos/tramitacion';
import { obtenerToken } from '@/servicios/auth';
import { apiUrl, urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';

export const buscarUnidadPorId = (
  idUnidad: string,
  operador:number
): [() => Promise<Unidadesrrhh | undefined>, () => void] => {
  const payLoad: PayloadTramitacion = {
    Accion: 2,
    RunTrabajador: '',
    CodigoUnidadRRHH: idUnidad,
    RunUsuario: '',
    RutEmpleador: '',
    Operador: operador,
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

  const buscarUnidadCodigo = async () => {
    const Unidad: Unidadesrrhh | undefined = (await resp())!?.unidadesrrhh.find(
      (value) => value.CodigoUnidadRRHH == idUnidad,
    );

    return Unidad;
  };

  return [buscarUnidadCodigo, abort];
};