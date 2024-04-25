import { urlBackendSuperUsuario } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';

export const buscarMensajeDesadscripcion = () => {
  return runFetchAbortable<{
    cuerpo: string;
  }>(`${urlBackendSuperUsuario()}/terminos/mensaje`, {
    headers: {
      'Content-type': 'application/json',
    },
  });
};
