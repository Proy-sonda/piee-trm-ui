import { obtenerToken, runFetchAbortable, urlBackendTramitacion } from '@/servicios';
import { EstadoLME } from '../(modelos)';

export interface BuscarEstadosLmeRequest {
  idoperador: number;
  folioLicencia: string;
}

export const buscarEstadosLME = (filtros: BuscarEstadosLmeRequest) => {
  const payload = {
    foliolicencia: filtros.folioLicencia,
    idoperador: filtros.idoperador,
  };

  return runFetchAbortable<EstadoLME>(`${urlBackendTramitacion()}/operadores/lmeconsultaestado`, {
    method: 'POST',
    headers: {
      authorization: obtenerToken(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
