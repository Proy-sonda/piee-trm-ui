import { obtenerToken } from '@/servicios/auth';
import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { CrearUnidadRRHHRequest } from '../(modelos)/crear-unidad-rrhh-request';

export const crearUnidad = (request: CrearUnidadRRHHRequest) => {
  const payload = {
    unidad: request.nombre,
    identificador: request.identificadorUnico,
    email: request.email,
    telefono: request.telefono,
    direccionunidad: {
      calle: request.calle,
      comuna: {
        idcomuna: request.comunaId,
        nombre: ' ',
      },
      depto: request.departamento,
      numero: request.numero,
    },
    estadounidadrrhh: {
      idestadounidadrrhh: 1,
      descripcion: 'SUSCRITO',
    },
    empleador: {
      idempleador: request.empleadorId,
    },
  };

  return runFetchConThrow<void>(`${apiUrl()}/unidad/create`, {
    method: 'POST',
    headers: {
      Authorization: obtenerToken(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
