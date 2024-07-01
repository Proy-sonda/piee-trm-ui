import { ConfiguracionClaveUnica } from '@/modelos/clave-unica/configuracion-clave-unica';
import { apiUrl } from '@/servicios';
import { runFetchAbortable } from '@/servicios/fetch';

export const buscarConfiguracionClaveUnica = () => {
  return runFetchAbortable<ConfiguracionClaveUnica>(`${apiUrl()}/claveunica/configuracion`, {
    method: 'POST',
  });
};
