import { obtenerToken } from '@/servicios/auth';
import { runFetchConThrow } from '@/servicios/fetch';
import { ActualizarEmpleadorBackendRequest } from '../(modelos)/actualizar-empleador-backend-backend';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ActualizarEmpleadorRequest {
  idEmpleador: number;
  rutEmpleador: string;
  razonSocial: string;
  nombreFantasia: string;
  telefono1: string;
  telefono2: string;
  email: string;
  emailconfirma: string;
  tipoEmpleadorId: number;
  cajaCompensacionId: number;
  actividadLaboralId: number;
  tamanoEmpresaId: number;
  sistemaRemuneracionId: number;
  calle: string;
  numero: string;
  depto: string;
  comunaId: string;
}

export const actualizarEmpleador = (request: ActualizarEmpleadorRequest) => {
  const req: ActualizarEmpleadorBackendRequest = {
    idempleador: request.idEmpleador,
    rutempleador: request.rutEmpleador,
    razonsocial: request.razonSocial,
    nombrefantasia: request.nombreFantasia,
    telefonohabitual: request.telefono1,
    telefonomovil: request.telefono2,
    email: request.email,
    emailconfirma: request.emailconfirma,
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

  return runFetchConThrow<void>(`${apiUrl}empleador/actualizar`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(req),
  });
};
