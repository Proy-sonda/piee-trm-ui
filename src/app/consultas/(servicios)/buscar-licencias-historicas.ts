import { obtenerToken, runFetchAbortable, urlBackendTramitacion } from '@/servicios';
import { format } from 'date-fns';
import { FiltroBusquedaLicenciasHistoricas, LicenciaHistorica } from '../(modelos)';

export const buscarLicenciasHistoricas = (request: FiltroBusquedaLicenciasHistoricas) => {
  const payload: any = {
    foliolicencia: request.folio ?? '',
    runtrabajador: request.runPersonaTrabajadora ?? '',
    estadolicencia: request.idEstado ?? 0,
    rutempleador: request.rutEntidadEmpleadora ?? '',
    indicadortipofecha: request.tipoPeriodo ?? 0,
    fechadesde: request.fechaDesde ? format(request.fechaDesde, 'yyyy-MM-dd HH:mm:ss') : '',
    fechahasta: request.fechaHasta ? format(request.fechaHasta, 'yyyy-MM-dd HH:mm:ss') : '',
  };

  if (request.unidadRRHH) {
    payload.unidadrrhh = {
      codigounidadrrhh: request.unidadRRHH.codigoUnidad,
      idoperador: request.unidadRRHH.idOperador,
    };
  }

  return runFetchAbortable<LicenciaHistorica[]>(
    `${urlBackendTramitacion()}/operadores/consultalme`,
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
