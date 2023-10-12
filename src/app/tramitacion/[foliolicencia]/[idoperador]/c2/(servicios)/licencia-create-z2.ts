import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { Licenciac2 } from '../(modelos)/licencia-c2';

export class ErrorCrearLicenciaC2 extends Error {}

export const crearLicenciaZ2 = async (licencia: Licenciac2) => {
  try {
    await runFetchConThrow<void>(`${urlBackendTramitacion()}/licencia/zona2/create`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(licencia),
    });
  } catch (error) {
    throw new ErrorCrearLicenciaC2();
  }
};
