import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { ActualizarEmpleadorRequest } from '../(modelos)/actualizar-empleador-request';

export const actualizarEmpleador = (request: ActualizarEmpleadorRequest) => {
  // TODO: Agregar el punto de referencia al payload
  const payload = {
    idempleador: request.idEmpleador,
    rutempleador: request.rutEmpleador,
    razonsocial: request.razonSocial,
    nombrefantasia: request.nombreFantasia,
    telefonohabitual: request.telefono1,
    telefonomovil: request.telefono2,
    email: request.email,
    emailconfirma: request.emailconfirma,
    holding: request.holding,
    tipoempleador: {
      idtipoempleador: request.tipoEmpleadorId,
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
      calle: request.calle,
      depto: request.depto,
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
