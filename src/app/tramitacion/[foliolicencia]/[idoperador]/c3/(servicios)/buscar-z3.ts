import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { desgloseFromGlosas } from '../(modelos)/desglose-de-haberes';
import { LicenciaC3, LicenciaC3Api, Renta, RentaApi } from '../(modelos)/licencia-c3';

export const buscarZona3 = (
  folioLicencia: string,
  idOperador: number,
): ReturnType<typeof runFetchAbortable<LicenciaC3 | undefined>> => {
  const [request, abortador] = runFetchAbortable<LicenciaC3Api | undefined>(
    `${urlBackendTramitacion()}/licencia/zona3/operadorfolio`,
    {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        foliolicencia: folioLicencia,
        idoperador: idOperador,
      }),
    },
  );

  const requestParseado = () =>
    request().then((licencia) => {
      if (!licencia) {
        return;
      }

      return <LicenciaC3>{
        folioLicencia: licencia.foliolicencia,
        operador: licencia.operador,
        porcentajeDesahucio: licencia.porcendesahucio,
        remuneracionImponiblePrevisional: licencia.montoimponible,
        rentas: licencia.licenciazc3rentas.filter((x) => x.tiporenta === 0).map(parsearRenta),
        rentasMaternidad: licencia.licenciazc3rentas
          .filter((x) => x.tiporenta === 1)
          .map(parsearRenta),
      };
    });

  return [requestParseado, abortador];
};

function parsearRenta(renta: RentaApi): Renta {
  return {
    idPrevision: renta.prevision.idprevision,
    periodo: parsearPeriodo(renta.periodorenta),
    montoImponible: renta.montoimponible,
    montoIncapacidad: renta.montoincapacidad,
    diasIncapacidad: renta.ndiasincapacidad,
    totalRemuneraciones: renta.totalrem,
    dias: renta.nrodias,
    tipoRenta: renta.tiporenta as 0 | 1,
    desgloseHaberes: desgloseFromGlosas(renta.licenciazc3haberes),
  };
}

function parsearPeriodo(periodorenta: number): string {
  const ano = `${periodorenta}`.substring(0, 4);
  const mes = `${periodorenta}`.substring(4, 6);

  return `${ano}-${mes}`;
}
