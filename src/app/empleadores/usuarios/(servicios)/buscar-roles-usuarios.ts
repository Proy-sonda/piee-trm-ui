import { runFetch } from '@/servicios/fetch';
import { RolUsuario } from '../(modelos)/rol-usuario';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarRolesUsuarios = () => {
  return runFetch<RolUsuario[]>(fetch(`${apiUrl}rol/all`));
};
