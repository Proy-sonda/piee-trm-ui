import { obtenerToken, runFetchAbortable, urlBackendTramitacion } from '@/servicios';
import { HistorialEstadoLME } from '../(modelos)';

export interface BuscarHistorialEstadosLmeRequest {
  idoperador: number;
  folioLicencia: string;
}

export const buscarHistorialEstadosLicencia = (filtros: BuscarHistorialEstadosLmeRequest) => {
  const payload = {
    foliolicencia: filtros.folioLicencia,
    idoperador: filtros.idoperador,
  };

  return runFetchAbortable<HistorialEstadoLME>(
    `${urlBackendTramitacion()}/operadores/lmeconsultaestado`,
    {
      method: 'POST',
      headers: {
        authorization: obtenerToken(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );
};
