import { obtenerToken, runFetchAbortable, urlBackendTramitacion } from '@/servicios';
import { RentasSugeridasAndRangoLmeAnterioresAPI } from '../(modelo)';

export interface PeriodosRentasSugeridasAndRangoLmeAnterioresRequest {
  idTipoLicencia: number;
  idCalidadTrabajador: number;
  /** Fecha de inicio de reposo de la licencia, en formato `yyyy-MM-dd` */
  fechaInicio: string;
}

export const buscarRentasSugeridasAndRangoLmeAnteriores = (
  request: PeriodosRentasSugeridasAndRangoLmeAnterioresRequest,
) => {
  const payload = {
    idtipolicencia: request.idTipoLicencia,
    idcalidadtrabajador: request.idCalidadTrabajador,
    fechaautdesde: request.fechaInicio,
  };

  return runFetchAbortable<RentasSugeridasAndRangoLmeAnterioresAPI>(
    `${urlBackendTramitacion()}/licencia/periodorenta`,
    {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );
};
