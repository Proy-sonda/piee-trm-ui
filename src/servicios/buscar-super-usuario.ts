import { SuperUsuarioMsg } from '@/modelos/obtener-usuario-sup';
import { runFetchAbortable, urlBackendSuperUsuario } from '.';

export const BuscarUsuarioSu = (rut: string) => {
  return runFetchAbortable<boolean | SuperUsuarioMsg>(
    `${urlBackendSuperUsuario()}/usuario/isrutexists`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rutusuario: rut,
      }),
    },
  );
};
