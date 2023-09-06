import { obtenerToken } from '@/servicios/auth';
import { runFetchConThrow } from '@/servicios/fetch';
import { EstadoUsuario } from '../(modelos)/estado-usuario';
import { RolUsuario } from '../(modelos)/rol-usuario';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface EditarUsuarioRequest {
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
  return runFetchConThrow<void>(`${apiUrl}usuario/update`, {
    method: 'PUT',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(datosUsuario),
  });
};
