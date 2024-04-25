import { obtenerToken, runFetchAbortable, urlBackendTramitacion } from '@/servicios';
import { LicenciasAnteriores } from '../(modelo)/licencias-anteriores';

export const BuscarLicenciasAnteriores = (rut: string) => {
  return runFetchAbortable<LicenciasAnteriores[]>(
    `${urlBackendTramitacion()}/licencia/licencias/run`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: obtenerToken(),
      },
      body: JSON.stringify({ ruttrabajador: rut }),
    },
  );
};
