import { PayloadTramitacion } from '@/modelos/payload-tramitacion';
import { DatoEmpleadorUnidad, Usuariosunidad } from '@/modelos/tramitacion';
import { obtenerToken } from '@/servicios/auth';
import { urlBackendTramitacion } from '@/servicios/environment';
import { runFetchAbortable } from '@/servicios/fetch';

export const buscarUsuariosAsociado = (
  idunidad: string,
  rutEmpleador: string,
): [() => Promise<Usuariosunidad[]>, () => void] => {
  const payLoad: PayloadTramitacion = {
    Accion: 3,
    CodigoUnidadRRHH: idunidad,
    RunTrabajador: '',
    RutEmpleador: rutEmpleador,
    RunUsuario: '',
  };
  console.log(payLoad);

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
    console.log(Usuarios);
    return Usuarios;
  };

  return [BuscarUsuarioUnidad, abort];
};
