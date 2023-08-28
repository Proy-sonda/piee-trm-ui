import { FetchError } from '@/app/servicios/fetch';
import { UsuarioEntidadEmpleadora } from '../(modelos)/UsuarioEntidadEmpleadora';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const buscarUsuarios = async (): Promise<
  [FetchError | undefined, UsuarioEntidadEmpleadora[]]
> => {
  await wait(1500);

  const usuarios: UsuarioEntidadEmpleadora[] = [
    {
      id: 110,
      rut: '6547562-6',
      nombres: 'Mister',
      apellidos: 'Popo',
      telefono1: '+569 9 8888 7777',
      telefono2: '+569 9 8888 7777',
      email: 'algun.correo@gmail.com',
      estado: 'Activo',
      rol: {
        idrol: 1,
        rol: 'ADMINISTRADOR',
      },
    },
    {
      id: 107,
      rut: '2785871-6',
      nombres: 'Chancha',
      apellidos: 'Pepa',
      telefono1: '999999999',
      telefono2: '987987987',
      email: 'c@p.comm',
      estado: 'Activo',
      rol: {
        idrol: 1,
        rol: 'ADMINISTRADOR',
      },
    },
    {
      id: 12,
      rut: '64689639-8',
      nombres: 'Pepito',
      apellidos: 'Perez 3',
      telefono1: '+569 9 8888 7777',
      telefono2: '+569 9 8888 7777',
      email: 'algun.correo@gmail.com',
      estado: 'Activo',
      rol: {
        idrol: 1,
        rol: 'ADMINISTRADOR',
      },
    },
  ];

  return [undefined, usuarios];
};
