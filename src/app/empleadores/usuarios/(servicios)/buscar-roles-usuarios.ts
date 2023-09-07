import { apiUrl } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';
import { RolUsuario } from '../(modelos)/rol-usuario';

export const buscarRolesUsuarios = () => {
  return runFetchAbortable<RolUsuario[]>(`${apiUrl()}/rol/all`);
};
