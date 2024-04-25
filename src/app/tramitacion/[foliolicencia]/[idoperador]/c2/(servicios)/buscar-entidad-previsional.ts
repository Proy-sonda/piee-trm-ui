import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { EntidadPrevisional } from '../(modelos)/entidad-previsional';

export const buscarEntidadPrevisional = (codigoregimenprevisional: number) => {
  return runFetchAbortable<EntidadPrevisional[]>(
    `${urlBackendTramitacion()}/entidadprevisional/codigoregimenprevisional`,
    {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        codigoregimenprevisional,
      }),
    },
  );
};
