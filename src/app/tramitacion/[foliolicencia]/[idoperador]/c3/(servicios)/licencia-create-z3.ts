import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { FormularioC3 } from '../(modelos)/formulario-c3';

export type LicenciaCrearZ3Request = FormularioC3 & {
  folioLicencia: string;
  idOperador: number;
};

export const licenciaCreateZ3 = (request: LicenciaCrearZ3Request) => {
  const payload = {
    foliolicencia: request.folioLicencia,
    operador: {
      idoperador: request.idOperador,
      operador: ' ',
    },
    porcendesahucio: request.porcentajeDesahucio,
    montoimponible: request.remuneracionImponiblePrevisional,

    // TODO: Como distingo de las rentas de maternidad? Agregar un flag (0=normal, 1=maternal)
    licenciazc3rentas: request.remuneraciones.map((renta) => ({
      prevision: {
        idprevision: renta.prevision,
      },
      periodorenta: 202308, // Tiene que ser tipo number y en formato `yyyyMM`. Enero parte en 1
      nrodias: renta.dias,
      montoimponible: renta.montoImponible,
      totalrem: 0, // Se manda en 0 cuando no se incluye
      montoincapacidad: 0, // Se manda en 0 cuando no se incluye
      ndiasincapacidad: 0, // Se manda en 0 cuando no se incluye
      licenciazc3haberes: [
        {
          tipohaber: 0, // Mandar la glosa, tal cual aparece en la pantalla
          montohaber: 0,
          periodorenta: {
            // Este no va ir
            idperiodorenta: 0,
          },
        },
      ],
    })),
  };

  return runFetchConThrow(`${urlBackendTramitacion()}/licencia/zona3/create`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
