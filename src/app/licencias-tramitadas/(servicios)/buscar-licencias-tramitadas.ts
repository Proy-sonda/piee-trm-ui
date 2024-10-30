import { obtenerToken, runFetchAbortable, urlBackendTramitacion } from '@/servicios';
import { existe } from '@/utilidades';
import { endOfDay, format, startOfDay } from 'date-fns';
import { FiltrosBuscarLicenciasTramitadas } from '../(modelos)';
import { LicenciaTramitada } from '../(modelos)/licencia-tramitada';

interface BuscarLicenciasTramitadasRequest extends FiltrosBuscarLicenciasTramitadas {
  pagina: number;
  tamanoPagina: number;
}

export const buscarLicenciasTramitadas = (request: BuscarLicenciasTramitadasRequest) => {
  const payload: any = {
    foliolicencia: request.folio ?? '',
    runtrabajador: request.runPersonaTrabajadora ?? '',
    estadolicencia: existe(request.idEstadoLicencia) ? request.idEstadoLicencia : 0,
    estadotramitacion: existe(request.idEstadoTramitacion) ? request.idEstadoTramitacion : 0,
    rutempleador: request.rutEntidadEmpleadora ?? '',
    indicadortipofecha: existe(request.tipoPeriodo) ? request.tipoPeriodo : 0,
    fechadesde: request.fechaDesde
      ? format(startOfDay(request.fechaDesde), 'yyyy-MM-dd HH:mm:ss')
      : '',
    fechahasta: request.fechaHasta
      ? format(endOfDay(request.fechaHasta), 'yyyy-MM-dd HH:mm:ss')
      : '',
    pagina: request.pagina,
    tamanopagina: request.tamanoPagina,
  };

  if (request.unidadRRHH) {
    payload.unidadrrhh = {
      codigounidadrrhh: request.unidadRRHH.codigoUnidad,
      idoperador: request.unidadRRHH.idOperador,
    };
  }

  return runFetchAbortable<{ licencias: LicenciaTramitada[]; numerolicencias: number }>(
    `${urlBackendTramitacion()}/licencia/tramitada/usuario`,
    {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );
};
