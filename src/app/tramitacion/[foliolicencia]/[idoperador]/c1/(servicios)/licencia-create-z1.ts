import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { LicenciaC1 } from '../(modelos)';

export class ErrorCrearLicenciaC1 extends Error {}

export const crearLicenciaZ1 = async (licencia: LicenciaC1) => {
  try {
    await runFetchConThrow<void>(`${urlBackendTramitacion()}/licencia/zona1/create`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(licencia),
    });
  } catch (error) {
    throw new ErrorCrearLicenciaC1();
  }
};
