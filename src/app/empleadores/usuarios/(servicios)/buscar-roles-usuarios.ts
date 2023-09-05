import { runFetchAbortable } from '@/servicios/fetch';
import { RolUsuario } from '../(modelos)/rol-usuario';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buscarRolesUsuarios = () => {
  return runFetchAbortable<RolUsuario[]>(`${apiUrl}rol/all`);
};
