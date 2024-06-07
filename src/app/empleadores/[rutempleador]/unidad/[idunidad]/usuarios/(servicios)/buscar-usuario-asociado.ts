import { PayloadTramitacion } from '@/modelos/payload-tramitacion';
import { DatoEmpleadorUnidad, Usuariosunidad } from '@/modelos/tramitacion';
import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';

export const buscarUsuariosAsociado = (
  idunidad: string,
  rutEmpleador: string,
  operador: number,
): [() => Promise<Usuariosunidad[]>, () => void] => {
  const payLoad: PayloadTramitacion = {
    Accion: 5,
    CodigoUnidadRRHH: idunidad,
    RutEmpleador: rutEmpleador,
    RunUsuario: '',
    RunTrabajador :'',
    Operador: operador,
  };
  const [resp, abort] = runFetchAbortable<DatoEmpleadorUnidad>(
    `${urlBackendTramitacion()}/operadores/all/obtieneempleadorrrhhusu`,
    {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payLoad),
    },
  );
  const BuscarUsuarioUnidad = async () => {
    const Usuarios: Usuariosunidad[] = (await resp()).usuariosunidad;

    return Usuarios;
  };

  return [BuscarUsuarioUnidad, abort];
};
