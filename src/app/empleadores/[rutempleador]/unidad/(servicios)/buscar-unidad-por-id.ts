import { PayloadTramitacion } from '@/modelos/payload-tramitacion';
import { DatoEmpleadorUnidad, Unidadesrrhh } from '@/modelos/tramitacion';
import { obtenerToken } from '@/servicios/auth';
import { apiUrl, urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';

export const buscarUnidadPorId = (
  idUnidad: string,
): [() => Promise<Unidadesrrhh | undefined>, () => void] => {
  const payLoad: PayloadTramitacion = {
    Accion: 2,
    RunTrabajador: '',
    CodigoUnidadRRHH: idUnidad,
    RunUsuario: '',
    RutEmpleador: '',
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
      (value) => value.codigounidadrrhh == idUnidad,
    );

    return Unidad;
  };

  return [buscarUnidadCodigo, abort];
};

/**
 * @deprecated
 * Usar {@link buscarUnidadPorId} en su lugar
 */
export const buscarUnidadPorIdViejo = async (idUnidad: number) => {
  const res = await fetch(`${apiUrl()}/unidad/idunidad`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      idunidad: idUnidad,
    }),
  });

  return res;
};
