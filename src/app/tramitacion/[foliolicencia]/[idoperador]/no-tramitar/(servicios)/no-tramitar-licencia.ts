import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { esFechaInvalida } from '@/utilidades';
import { format } from 'date-fns';
import { FormularioNoTramitarLicencia } from '../(modelos)/formulario-no-tramitar-licencia';

type NoTramitarRequest = FormularioNoTramitarLicencia & {
  folioLicencia: string;
  idOperador: number;
};

export const noTamitarLicenciaMedica = (request: NoTramitarRequest) => {
  // return new Promise<void>((r) => setTimeout(r, 1000));

  const payload = {
    foliolicencia: request.folioLicencia,
    operador: {
      idoperador: request.idOperador,
      operador: ' ',
    },
    fechaterminorelacion: esFechaInvalida(request.fechaTerminoRelacion)
      ? ''
      : format(request.fechaTerminoRelacion, 'yyyy-MM-dd'),
    motivonorecepcion: {
      idmotivonorecepcion: parseInt(request.motivoRechazo, 10),
      motivonorecepcion: ' ',
    },
    ccaf: {
      idccaf: isNaN(request.entidadPagadoraId) ? 0 : request.entidadPagadoraId,
      nombre: ' ',
    },
    otromotivonorecepcion: request.otroMotivoDeRechazo,
  };

  return runFetchAbortable<void>(`${urlBackendTramitacion()}/licencia/norecepcion`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
