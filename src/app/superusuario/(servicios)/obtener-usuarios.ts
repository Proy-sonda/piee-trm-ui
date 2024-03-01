import { apiUrl, runFetchAbortable } from '@/servicios';
import { Usuarios } from '../(modelos)/usuarios-sistema';

export const ObtenerUsuarios = (rutusuario: string, nombres: string) => {
  return runFetchAbortable<Usuarios[]>(`${apiUrl()}/usuario/super/rutusuario`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rutusuario,
      nombres,
    }),
  });
};
