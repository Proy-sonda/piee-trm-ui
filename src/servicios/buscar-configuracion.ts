import { Configuracion } from '@/modelos/configuracion';
import { runFetchAbortable, urlBackendSuperUsuario } from '.';

export const BuscarConfiguracion = () =>
  runFetchAbortable<Configuracion[]>(`${urlBackendSuperUsuario()}/configuracion/all`);

export const BuscarConfigSesion = () =>
  runFetchAbortable<
    {
      idtiemposesion: number;
      descripcion: string;
    }[]
  >(`${urlBackendSuperUsuario()}/configuracion/configuracionSesion/all`);
