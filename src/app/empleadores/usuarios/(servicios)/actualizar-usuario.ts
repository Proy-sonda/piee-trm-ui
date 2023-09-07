import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { EstadoUsuario } from '../(modelos)/estado-usuario';
import { RolUsuario } from '../(modelos)/rol-usuario';

interface EditarUsuarioRequest {
  idusuario: number;
  rutusuario: string;
  nombres: string;
  apellidos: string;
  email: string;
  emailconfirma: string;
  telefonouno: string;
  telefonodos: string;
  rol: RolUsuario;
  estadousuario: EstadoUsuario;
}

export const actualizarUsuario = (datosUsuario: EditarUsuarioRequest) => {
  return runFetchConThrow<void>(`${apiUrl()}/usuario/update`, {
    method: 'PUT',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(datosUsuario),
  });
};
