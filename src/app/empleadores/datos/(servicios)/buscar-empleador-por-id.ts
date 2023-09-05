import { obtenerToken } from '@/servicios/auth';
import { runFetchConThrow } from '@/servicios/fetch';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarEmpleadorPorId = (idEmpleador: string) => {
  return runFetchConThrow<void>(
    fetch(`${apiUrl}empleador/idempleador`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ idempleador: idEmpleador }),
    }),
  );
};
