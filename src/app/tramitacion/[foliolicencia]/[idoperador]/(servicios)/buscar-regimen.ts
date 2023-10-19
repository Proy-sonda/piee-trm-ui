import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { regimen } from '../(modelo)/regimen';

export const buscarRegimen = () => {
  return runFetchAbortable<regimen[]>(`${urlBackendTramitacion()}/regimenprevisional/all`, {
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
  });
};
