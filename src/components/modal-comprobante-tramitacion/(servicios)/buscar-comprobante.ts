import { obtenerToken, runFetchAbortable, urlBackendTramitacion } from '@/servicios';
import { ComprobanteTramitacion } from '../(modelo)/comprobante';

export const BuscarComprobante = (folio: string, operador: number) => {
  return runFetchAbortable<ComprobanteTramitacion>(
    `${urlBackendTramitacion()}/licencia/obtenercomprobante/${folio}/${operador}`,
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: obtenerToken(),
      },
    },
  );
};
