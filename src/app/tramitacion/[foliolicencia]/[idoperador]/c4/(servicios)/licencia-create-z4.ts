import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { format } from 'date-fns';
import { FormularioC4 } from '../(modelos)/formulario-c4';

export type LicenciaCrearZ4Request = FormularioC4 & {
  folioLicencia: string;
  idOperador: number;
};

export const crearLicenciaZ4 = (request: LicenciaCrearZ4Request) => {
  const payload = {
    foliolicencia: request.folioLicencia,
    operador: {
      idoperador: request.idOperador,
      operador: ' ',
    },
    licenciazc4: request.licenciasAnteriores.map((licencia) => ({
      lmandias: licencia.dias,
      lmafechadesde: format(licencia.desde, 'yyyy-MM-dd'),
      lmafechahasta: format(licencia.hasta, 'yyyy-MM-dd'),
    })),
  };

  return runFetchConThrow(`${urlBackendTramitacion()}/licencia/zona4/create`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
