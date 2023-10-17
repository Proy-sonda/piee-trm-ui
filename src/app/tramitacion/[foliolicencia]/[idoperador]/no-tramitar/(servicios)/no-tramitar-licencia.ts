import { LicenciaTramitar } from '@/app/tramitacion/(modelos)/licencia-tramitar';
import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { esFechaInvalida } from '@/utilidades';
import { format } from 'date-fns';
import { FormularioNoTramitarLicencia } from '../(modelos)/formulario-no-tramitar-licencia';
import { crearLicenciaZ0 } from '../../c1/(servicios)';

type NoTramitarRequest = FormularioNoTramitarLicencia & {
  folioLicencia: string;
  idOperador: number;
};

export class NoPuedeCrearZona0Error extends Error {}

export class NoTramitarError extends Error {}

export const noTamitarLicenciaMedica = async (
  licencia: LicenciaTramitar,
  request: NoTramitarRequest,
) => {
  try {
    await crearLicenciaZ0({
      foliolicencia: licencia.foliolicencia,
      operador: licencia.operador,
      ruttrabajador: licencia.runtrabajador,
      apellidopaterno: licencia.apellidopaterno,
      apellidomaterno: licencia.apellidomaterno,
      nombres: licencia.nombres,
      fechaemision: format(new Date(licencia.fechaemision), 'yyyy-MM-dd'),
      fechainicioreposo: format(new Date(licencia.fechainicioreposo), 'yyyy-MM-dd'),
      ndias: licencia.diasreposo,
      tipolicencia: licencia.tipolicencia,
      estadolicencia: licencia.estadolicencia,
      motivodevolucion: licencia.motivodevolucion,
      fechaestado: format(new Date(licencia.fechaestadolicencia), 'yyyy-MM-dd'),
      estadotramitacion: {
        idestadotramitacion: 1, // 1 = PENDIENTE
        estadotramitacion: ' ',
      },
      entidadsalud: {
        identidadsalud: licencia.entidadsalud.identidadsalud,
        nombre: licencia.entidadsalud.nombre,
      },
    });
  } catch (error) {
    throw new NoPuedeCrearZona0Error();
  }

  try {
    const payloadNoRecepcion = {
      foliolicencia: request.folioLicencia,
      operador: {
        idoperador: request.idOperador,
        operador: ' ',
      },
      fechaterminorelacion: esFechaInvalida(request.fechaTerminoRelacion)
        ? null
        : format(request.fechaTerminoRelacion, 'yyyy-MM-dd'),
      motivonorecepcion: {
        idmotivonorecepcion: parseInt(request.motivoRechazo, 10),
        motivonorecepcion: ' ',
      },
      ccaf: {
        idccaf: isNaN(request.entidadPagadoraId) ? 10100 : request.entidadPagadoraId, // 10100 = "NO SE TRAMITA EN CCAF"
        nombre: ' ',
      },
      otromotivonorecepcion: request.otroMotivoDeRechazo,
    };

    await runFetchConThrow<void>(`${urlBackendTramitacion()}/licencia/norecepcion`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payloadNoRecepcion),
    });
  } catch (error) {
    throw new NoTramitarError();
  }
};
