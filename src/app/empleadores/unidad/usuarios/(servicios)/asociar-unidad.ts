import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { formUsrUnd } from '../(modelos)/iformusrund';

export const asociarUnidad = (usuario: formUsrUnd) => {
  return runFetchConThrow<void>(`${apiUrl()}/usuarioempleador/create`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(usuario),
  });
};
