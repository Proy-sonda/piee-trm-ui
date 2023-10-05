import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { LicenciaCreate } from '../(modelo)/licencia-create';

export const crearLicencia = async (licencia: LicenciaCreate) => {
  try {
    await runFetchConThrow<void>(`${urlBackendTramitacion()}/licencia/create`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(licencia),
    });
  } catch (error) {}
};
