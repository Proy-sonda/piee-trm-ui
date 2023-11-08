import { InscribirEmpleadorRequest } from '@/app/empleadores/(modelos)/inscribir-empleador-request';
import { obtenerToken } from '@/servicios/auth';
import { apiUrl, urlBackendTramitacion } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';

export class EmpleadorYaExisteError extends Error {}

export const inscribirEmpleador = async (
  request: InscribirEmpleadorRequest,
  RunUsuario: string,
) => {
  const payload = {
    rutempleador: request.rut,
    razonsocial: request.razonSocial,
    telefonohabitual: request.telefono1,
    telefonomovil: request.telefono2,
    email: request.email,
    emailconfirma: request.emailConfirma,
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
      comuna: {
        idcomuna: request.comunaId,
        nombre: ' ',
      },
      calle: request.calle,
      depto: request.departamento,
      numero: request.numero,
    },
  };

  const payloadOperador = {
    RunUsuario,
    empleador: {
      accion: 1,
      rutempleador: request.rut,
      nombrerazonsocial: request.razonSocial,
      nombrefantasia: '',
      tipoempleador: request.tipoEntidadEmpleadoraId,
      codigoccaf: request.cajaCompensacionId,
      codigoactividadlaboral: request.actividadLaboralId,
      codigoregion: request.regionId,
      codigocomuna: request.comunaId,
      codigotipocalle: 1,
      direccion: request.calle,
      numero: request.numero,
      blockdepto: request.departamento,
      telefono1: request.telefono1,
      telefono2: request.telefono2,
      correoelectronico: request.emailConfirma,
      nombreholding: '',
      codigocantidadtrabajadores: request.tamanoEmpresaId,
      codigosistemaremuneraciones: request.sistemaRemuneracionId,
    },
  };

  try {
    await runFetchConThrow<void>(
      `${urlBackendTramitacion()}/operadores/actualizaempleadorusuario`,
      {
        method: 'PUT',
        headers: {
          Authorization: obtenerToken(),
          'Content-type': 'application/json',
        },
        body: JSON.stringify(payloadOperador),
      },
    );
    await runFetchConThrow<void>(`${apiUrl()}/empleador/inscribir`, {
      method: 'POST',
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error: any) {
    if (error.body.message.includes('rutempleador|ya existe')) {
      throw new EmpleadorYaExisteError();
    }

    throw error;
  }
};
