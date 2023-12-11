import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { parse, startOfMonth } from 'date-fns';
import { LicenciaC3, LicenciaC3API, RentaAPI, RentaC3, desgloseFromGlosas } from '../(modelos)';
import { crearIdEntidadPrevisional } from '../../c2/(modelos)';

export const buscarZona3 = (
  folioLicencia: string,
  idOperador: number,
): ReturnType<typeof runFetchAbortable<LicenciaC3 | undefined>> => {
  const [request, abortador] = runFetchAbortable<LicenciaC3API | undefined>(
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
        operador: {
          idOperador: licencia.operador.idoperador,
          glosa: licencia.operador.operador,
        },
        porcentajeDesahucio: licencia.porcendesahucio,
        remuneracionImponiblePrevisional: licencia.montoimponible,
        licenciazc3adjuntos: licencia.licenciazc3adjuntos,
        rentas: licencia.licenciazc3rentas.filter((x) => x.tiporenta === 0).map(parsearRenta),
        rentasMaternidad: licencia.licenciazc3rentas
          .filter((x) => x.tiporenta === 1)
          .map(parsearRenta),
      };
    });

  return [requestParseado, abortador];
};

function parsearRenta(renta: RentaAPI): RentaC3 {
  return {
    idPrevision: crearIdEntidadPrevisional(renta.entidadprevisional),
    periodo: parsearPeriodo(renta.periodorenta),
    montoImponible: renta.montoimponible,
    montoIncapacidad: renta.montoincapacidad,
    diasIncapacidad: renta.ndiasincapacidad,
    totalRemuneracion: renta.totalrem,
    dias: renta.nrodias,
    tipoRenta: renta.tiporenta as 0 | 1,
    desgloseHaberes: desgloseFromGlosas(renta.licenciazc3haberes),
  };
}

function parsearPeriodo(periodorenta: number): Date {
  const ano = `${periodorenta}`.substring(0, 4);
  const mes = `${periodorenta}`.substring(4, 6);

  return parse(`${ano}-${mes}`, 'yyyy-MM', startOfMonth(new Date()));
}
