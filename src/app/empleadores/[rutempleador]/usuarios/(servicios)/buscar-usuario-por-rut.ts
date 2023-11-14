import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { UsuarioEntidadEmpleadoraAPI } from '../(modelos)/usuario-entidad-empleadora-api';

export const buscarUsuarioPorRut = (rut: string) => {
  return runFetchAbortable<UsuarioEntidadEmpleadoraAPI | undefined>(
    `${apiUrl()}/usuario/rutusuario`,
    {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        rutusuario: rut,
      }),
    },
  );
};
