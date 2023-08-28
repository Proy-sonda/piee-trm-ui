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
      idusuario: 110,
      rutusuario: '6547562-6',
      nombres: 'Mister',
      apellidos: 'Popo',
      email: 'mister.popo@gmail.com',
      telefonouno: '+569 9 8888 7777',
      telefonodos: '+569 9 8888 7777',
      rol: {
        idrol: 1,
        rol: 'ADMINISTRADOR',
      },
      estadousuario: {
        idestadousuario: 1,
        descripcion: 'HABILITADO',
      },
    },
    {
      idusuario: 109,
      rutusuario: '53687086-5',
      nombres: 'Chancha',
      apellidos: 'Pepa',
      email: 'chancha.pepa@gmail.com',
      telefonouno: '999999999',
      telefonodos: '987987987',
      rol: {
        idrol: 1,
        rol: 'ADMINISTRADOR',
      },
      estadousuario: {
        idestadousuario: 1,
        descripcion: 'HABILITADO',
      },
    },
    {
      idusuario: 108,
      rutusuario: '34494558-6',
      nombres: 'Charizard',
      apellidos: 'Rodriguez',
      email: 'charizard@gmail.com',
      telefonouno: '999999999',
      telefonodos: '987987987',
      rol: {
        idrol: 1,
        rol: 'ADMINISTRADOR',
      },
      estadousuario: {
        idestadousuario: 1,
        descripcion: 'HABILITADO',
      },
    },
    {
      idusuario: 107,
      rutusuario: '2785871-6',
      nombres: 'Pikachu',
      apellidos: 'Perez',
      email: 'pikachu@gmail.com',
      telefonouno: '999999999',
      telefonodos: '987987987',
      rol: {
        idrol: 1,
        rol: 'ADMINISTRADOR',
      },
      estadousuario: {
        idestadousuario: 1,
        descripcion: 'HABILITADO',
      },
    },
  ];

  return [undefined, usuarios];
};
