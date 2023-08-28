import { obtenerToken } from '@/app/servicios/auth';
import { runFetchConThrow } from '@/app/servicios/fetch/runFetchConThrow';
import { EstadoUsuario } from '../(modelos)/EstadoUsuario';
import { RolUsuario } from '../(modelos)/RolUsuario';

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
  return runFetchConThrow<void>(
    fetch(`${apiUrl}usuario/update`, {
      method: 'PUT',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(datosUsuario),
    }),
  );
};
