import { FetchError } from '@/app/servicios/fetch';
import { UsuarioEntidadEmpleadora } from '../(modelos)/UsuarioEntidadEmpleadora';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const buscarUsuarioPorId = async (
  id: number,
): Promise<[FetchError | undefined, UsuarioEntidadEmpleadora]> => {
  await wait(1500);

  const usuario: UsuarioEntidadEmpleadora = {
    id: 110,
    rut: '6547562-6',
    nombres: 'Mister',
    apellidos: 'Popp',
    email: 'm@p.com',
    estado: 'Activo',
    telefono1: '999999999',
    telefono2: '987987987',
    rol: {
      idrol: 1,
      rol: 'ADMINISTRADOR',
    },
  };

  return [undefined, usuario];
};
