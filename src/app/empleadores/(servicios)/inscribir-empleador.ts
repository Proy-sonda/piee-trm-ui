import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { FormularioInscribirEntidadEmpleadora } from '../(modelos)/formulario-inscribir-entidad-empleadora';

interface InscribirEmpleadorRequest extends FormularioInscribirEntidadEmpleadora {}

export class EmpleadorYaExisteError extends Error {}
export class RepresentateLegalInvalidoError extends Error {}
export class EmpleadorBloqueadoError extends Error {}

/**
 * Inscribe un nuevo empleador
 *
 * @throws {EmpleadorYaExisteError} Cuando ya existe un empleador con el RUT indicado.
 * @throws {RepresentateLegalInvalidoError} Cuando el usuario administrador no es representante legal del empleador indicado.
 * @throws {EmpleadorBloqueadoError} Cuando el RUT del empleador ha sido bloqueado.
 */
export const inscribirEmpleador = async (request: InscribirEmpleadorRequest) => {
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
      tipocalle: {
        idtipocalle: request.tipoCalleId,
        tipocalle: ' ',
      },
      comuna: {
        idcomuna: request.comunaId,
        nombre: ' ',
      },
      calle: request.calle,
      depto: request.departamento,
      numero: request.numero,
    },
    emailusuario: request.emailUsuario,
    emailusuarioconfirma: request.emailUsuarioConfirma,
  };

  try {
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

    if (error.body.message === 'empleador bloqueado') {
      throw new EmpleadorBloqueadoError();
    }

    if (error.body.message === 'usuario no es el repsentante legal') {
      throw new RepresentateLegalInvalidoError();
    }

    throw error;
  }
};
