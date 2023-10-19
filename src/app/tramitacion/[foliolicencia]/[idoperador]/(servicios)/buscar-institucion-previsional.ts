import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { institucionPrevisional } from '../(modelo)/institucion-previsional';

export const buscarInstitucionPrevisional = () => {
  return runFetchAbortable<institucionPrevisional[]>(
    `${urlBackendTramitacion()}/entidadprevisional/all`,
    {
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
    },
  );
};
