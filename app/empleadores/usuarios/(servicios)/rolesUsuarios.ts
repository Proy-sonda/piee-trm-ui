import { runFetch } from '@/app/servicios/fetch';
import { RolUsuario } from '../(modelos)/RolUsuario';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarRolesUsuarios = () => {
  return runFetch<RolUsuario[]>(fetch(`${apiUrl}rol/all`));
};
