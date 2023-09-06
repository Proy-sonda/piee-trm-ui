import { obtenerToken } from '@/servicios/auth';
import { runFetchConThrow } from '@/servicios/fetch';
import { formUsrUnd } from '../(modelos)/iformusrund';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const asociarUnidad = (usuario: formUsrUnd) => {
  return runFetchConThrow<void>(`${apiUrl}usuarioempleador/create`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(usuario),
  });
};
