import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { CamposFormularioEmpleador } from '../(modelos)';

interface ActualizarEmpleadorRequest extends CamposFormularioEmpleador {
  idEmpleador: number;
  runUsuario: string;
}

export const actualizarEmpleador = (request: ActualizarEmpleadorRequest) => {
  const payload = {
    idempleador: request.idEmpleador,
    rutempleador: request.rut,
    razonsocial: request.razonSocial,
    nombrefantasia: request.nombreFantasia,
    telefonohabitual: request.telefono1,
    telefonomovil: request.telefono2,
    email: request.email,
    emailconfirma: request.emailConfirma,
    holding: request.holding,
    tipoempleador: {
      idtipoempleador: request.tipoEntidadEmpleadoraId,
      tipoempleador: ' ',
    },
    ccaf: {
      idccaf: request.cajaCompensacionId,
      nombre: ' ',
    },
    actividadlaboral: {
      idactividadlaboral: request.actividadLaboralId,
      actividadlaboral: ' ',
    },
    tamanoempresa: {
      idtamanoempresa: request.tamanoEmpresaId,
      descripcion: ' ',
      nrotrabajadores: 0,
    },
    sistemaremuneracion: {
      idsistemaremuneracion: request.sistemaRemuneracionId,
      descripcion: ' ',
    },
    direccionempleador: {
      tipocalle: {
        idtipocalle: request.tipoCalleId,
        tipocalle: ' ',
      },
      calle: request.calle,
      depto: request.departamento,
      numero: request.numero,
      comuna: {
        idcomuna: request.comunaId,
        nombre: ' ',
      },
    },
  };

  return runFetchConThrow<void>(`${apiUrl()}/empleador/actualizar`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
