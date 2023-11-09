import { obtenerToken } from '@/servicios/auth';
import { apiUrl, urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { ActualizarEmpleadorRequest } from '../(modelos)/actualizar-empleador-request';

export const actualizarEmpleador = (request: ActualizarEmpleadorRequest, RunUsuario: string) => {
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

  const payloadOperador = {
    RunUsuario,
    empleador: {
      accion: 2,
      rutempleador: request.rutEmpleador,
      nombrerazonsocial: request.razonSocial,
      nombrefantasia: request.nombreFantasia,
      tipoempleador: request.tipoEmpleadorId,
      codigoccaf: request.cajaCompensacionId,
      codigoactividadlaboral: request.actividadLaboralId,
      codigoregion: request.comunaId.substring(0, 2),
      codigocomuna: request.comunaId,
      codigotipocalle: 1,
      direccion: request.calle,
      numero: request.numero,
      blockdepto: request.depto,
      telefono1: request.telefono1,
      telefono2: request.telefono2,
      correoelectronico: request.emailconfirma,
      nombreholding: '',
      codigocantidadtrabajadores: request.tamanoEmpresaId,
      codigosistemaremuneraciones: request.sistemaRemuneracionId,
    },
  };

  runFetchConThrow<void>(`${urlBackendTramitacion()}/operadores/actualizaempleadorusuario`, {
    method: 'PUT',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payloadOperador),
  });

  return runFetchConThrow<void>(`${apiUrl()}/empleador/actualizar`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
