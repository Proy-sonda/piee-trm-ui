import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { format } from 'date-fns';
import { DesgloseDeHaberes, obtenerGlosaDesglosaHaberes } from '../(modelos)/desglose-de-haberes';
import { FormularioC3, Remuneracion } from '../(modelos)/formulario-c3';
import { parsearIdEntidadPrevisional } from '../../c2/(modelos)/entidad-previsional';

export type LicenciaCrearZ3Request = FormularioC3 & {
  folioLicencia: string;
  idOperador: number;
};

export const crearLicenciaZ3 = (request: LicenciaCrearZ3Request) => {
  const remuneraciones = request.remuneraciones.map(convertirRemuneracion(0));
  const remuneracionesMaternidad = request.remuneracionesMaternidad.map(convertirRemuneracion(1));

  const payload = {
    foliolicencia: request.folioLicencia,
    operador: {
      idoperador: request.idOperador,
      operador: ' ',
    },
    porcendesahucio: request.porcentajeDesahucio,
    montoimponible: request.remuneracionImponiblePrevisional,
    licenciazc3rentas: remuneraciones.concat(remuneracionesMaternidad),
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

/** @param tipoRenta 0 = normal, 1 = maternal */
function convertirRemuneracion(tipoRenta: number) {
  return (remuneracion: Remuneracion) => {
    const haberes = Object.entries(remuneracion.desgloseHaberes);
    const idParseada = parsearIdEntidadPrevisional(remuneracion.prevision);

    return {
      tiporenta: tipoRenta,
      periodorenta: parseInt(format(new Date(remuneracion.periodoRenta), 'yyyyMM'), 10),
      nrodias: remuneracion.dias,
      montoimponible: remuneracion.montoImponible,
      totalrem: remuneracion.totalRemuneracion,
      montoincapacidad: remuneracion.montoIncapacidad,
      ndiasincapacidad: remuneracion.diasIncapacidad,
      entidadprevisional: {
        codigoentidadprevisional: idParseada.codigoentidadprevisional,
        codigoregimenprevisional: idParseada.codigoregimenprevisional,
        letraentidadprevisional: idParseada.letraentidadprevisional,
      },
      licenciazc3haberes: haberes.map(([key, value]) => ({
        tipohaber: obtenerGlosaDesglosaHaberes(key as keyof DesgloseDeHaberes),
        montohaber: value,
      })),
    };
  };
}
