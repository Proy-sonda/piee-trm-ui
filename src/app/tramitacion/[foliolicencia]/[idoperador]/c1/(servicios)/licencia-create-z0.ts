import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { LicenciaC0 } from '../(modelos)/';

export class ErrorCrearLicencia extends Error {}

export const crearLicenciaZ0 = async (licencia: LicenciaC0) => {
  try {
    await runFetchConThrow<void>(`${urlBackendTramitacion()}/licencia/zona0/create`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(licencia),
    });
  } catch (error: any) {
    throw new ErrorCrearLicencia();
  }
};
