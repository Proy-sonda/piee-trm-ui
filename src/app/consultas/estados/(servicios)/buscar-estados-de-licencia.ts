import { obtenerToken, runFetchAbortable, urlBackendTramitacion } from '@/servicios';
import { EstadoLME, FormularioBusquedaEstadoLME } from '../(modelos)';

export const buscarEstadosLME = (filtros: FormularioBusquedaEstadoLME) => {
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
